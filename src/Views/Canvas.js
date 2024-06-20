import { Component } from "react";
import { ViewShapeApi } from "../Api/shape.api.js";
import CanvasHeader from "../Components/Canvas/Header.js";
import CanvasMenu from "../Components/Canvas/Menu.js";
import CanvasLeftSidebar from "../Components/Canvas/LeftSidebar.js";
import CanvasArea from "../Components/Canvas/CanvasArea.js";
import CanvasRightSidebar from "../Components/Canvas/RightSidebar.js";
import CanvasFooter from "../Components/Canvas/CanvasFooter.js";
import {
  addUpdateChart,
  addUpdateTemplets,
  getChartInfo,
  getCharts,
  getTemplets,
} from "../Api/chart.api.js";
import { io } from "socket.io-client";
import Speech from "speak-tts"; // es6
import { getFlowchart } from "../Api/flowchart.api.js";
import axios from "axios";

class Canvas extends Component {
  state = {
    svg_chart_styles: {
      inset: "10px 0 0 0",
    },
    zoom: 0,
    other_w_chart: 1,
    other_h_chart: 1,
    base_chart_viewbox: "0 0 842 595",
    base_chart_width: 842,
    base_chart_height: 595,
    svg_chart_width: 842,
    svg_chart_height: 595,
    shapes: [],
    sidebarShapes: {},
    nodes: {
      shapes: [],
      connector: [],
    },
    drag_type: null,
    templateChart: null,
    activeNode: null,
    current: null,
    resizeDir: null,
    connectorDir: null,
    showContextMultiSelectMenu: false,
    showContextMenu: false,
    showSelectionMenu: false,
    showEditorPopup: false,
    TextEditorPopupPos: null,
    showTextEditorPopup: false,
    isFullScreen: false,
    flowchartBoardOpen: false,
    dropdownOpen: null,
    connectorFocused: null,
    openConnectorContextMenu: null,
    activeArrow: "arrow",
    activeDashArray: "0,0",
    undo_process: [],
    redo_process: [],
    multiSelection: false,
    multiSelectionStatus: null,
    minchart_style: {},
    offset: {
      offsetX: 0,
      offsetY: 0,
    },
    chart: {},
    chart_name: null,
    pages: [],
    currentPage: 1,
    loading: true,
    workflowsStart: false,
    workflowsPlayMode: false,
    workflowsPaused: true,
    workflowShapes: [],
    workflowPlayList: [],
    clients: {},
    pointers: {},
    socket: null,
    speech: null,
    workflows: [],
    workflowIndex: 0,
    volume: 0.7,
    tolang: "en",
    fromlang: "en",
    rate: 1,
    pitch: 1,
    speakText: [],
    voice: "Google UK English Female",
    speechOptions: {
      volume: 0.7,
      lang: "en-US",
      rate: 1,
      pitch: 1,
      voice: "Google UK English Female",
      // 'splitSentences': true,
      // listeners: {
      //     onvoiceschanged: voices => {
      //         console.log("Voices changed", voices);
      //     }
      // }
    },
    chartdetails: {},
    charts: [],
    save_status: false,
  };

  resetWorkflow = () => {
    this.setState({
      workflowShapes: [],
      workflowsPaused: true,
      workflowIndex: 0,
    });
  };

  strip_html_tags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/<[^>]*>/g, "");
  }

  enterWorkflow = (id) => {
    // this.resetWorkflow();
    this.setState({ workflowsStart: true, workflowsPlayMode: false });
  };

  playWorkflow = async (row) => {
    const speech = await new Speech();
    if (speech.hasBrowserSupport()) {
      // returns a boolean
      console.log("speech synthesis supported");
    }
    this.setState({ speech });
    await speech
      .init(
        this.state.volume,
        this.state.tolang,
        this.state.rate,
        this.state.pitch
        // this.state.voice,
      )
      .then((data) => {
        console.log("Speech is ready", data);
        // this._addVoicesList(data.voices);
        this.playAudioList(speech);
      });
    // this.resetWorkflow();
    this.setState({
      workflowsStart: true,
      workflowsPlayMode: true,
      workflowPlayList: row.workflow,
      speech,
    });
    // this.playPauseWorkflow(row);
  };

  playAudioList = async (speech, index) => {
    await speech.init(
      this.state.volume,
      this.state.tolang,
      this.state.rate,
      this.state.pitch
      // this.state.voice,
    );
    let workflowShapes = this.state.workflowShapes;
    let self = this;
    let text;
    if (index <= this.state.workflowPlayList.length - 1) {
      if (workflowShapes[index] !== this.state.workflowPlayList[index])
        workflowShapes.push(this.state.workflowPlayList[index]);
      this.setState({ workflowShapes });

      let node = this.state.nodes.shapes.filter((n) => {
        return n.id === this.state.workflowPlayList[index];
      });

      node = node[0];

      text = node.name;
      if (node.description && node.description.length) {
        text += ".\n" + this.strip_html_tags(node.description);
      }
      this.setState({
        speakText: text,
      });
      speech
        .speak({
          text,
          queue: false,
          listeners: {
            onstart: () => {
              console.log("Start utterance");
            },
            onend: () => {
              console.log("End utterance");
            },
            onresume: () => {
              console.log("Resume utterance");
            },
            onboundary: (event) => {
              // console.log(
              // event.name +
              //     " boundary reached after " +
              //     event.elapsedTime +
              //     " milliseconds."
              // );
            },
          },
        })
        .then((data) => {
          if (this.state.workflowsPaused) {
            index = parseInt(index) + 1;
            self.setState({ workflowIndex: index });
            // console.log('new index success: ', index, data);
            // index++;
            if (index <= this.state.workflowPlayList.length - 1) {
              self.playAudioList(speech, index);
            } else {
              self.setState({ workflowsPaused: false });
            }
          }
        })
        .catch((e) => {
          console.error("An error occurred :", e);
        });
    } else {
      self.setState({ workflowShapes: [], workflowIndex: 0 });
      self.playAudioList(speech, 0);
    }
  };

  playPauseWorkflow = (e, change_status = false) => {
    let { workflowIndex } = this.state;
    if (change_status) {
      this.setState({
        workflowsPaused: !this.state.workflowsPaused,
      });
    }
    let { speech } = this.state;

    // console.log('workflow index: ', workflowIndex, this.state.workflowsPaused);

    if (change_status) {
      if (!this.state.workflowsPaused) {
        speech.resume();
      } else {
        speech.pause();
      }
    }

    // if (this.state.workflowsPaused && speech) {
    //     this.playAudioList(speech, workflowIndex);
    // }
  };

  handleVoice = (e) => {
    this.setState({
      voice: e.target.value,
    });
  };

  handleVolume = (e) => {
    this.setState({
      volume: e.target.value,
    });
  };

  handleToLanguage = (e) => {
    this.setState({
      tolang: e.target.value,
    });
    const params = new URLSearchParams();
    params.append("q", this.state.speakText);
    params.append("source", this.state.fromlang);
    params.append("target", this.state.tolang);
    params.append("api_key", "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
    axios
      .post("https://libretranslate.de/translate", params, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        this.setState({
          speakText: res.data.translatedText,
        });
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };

  handleFromLanguage = (e) => {
    this.setState({
      fromlang: e.target.value,
    });
  };

  backToCanvas = () => {
    this.resetWorkflow();
    this.setState({
      workflowsStart: false,
      workflowsPaused: true,
      workflowIndex: 0,
      workflowShapes: [],
    });
  };

  getAllShapes = async () => {
    let shapes = await ViewShapeApi("type=type-wise");

    console.log("shapes: ", shapes);

    this.setState({
      shapes: shapes.data.allShapes,
      sidebarShapes: shapes.data.shapes,
    });

    return shapes.data;
  };

  getAllCharts = async () => {
    let charts = await getCharts();

    console.log("charts: ", charts);

    this.setState({ charts: charts.data });

    return charts.data;
  };

  toggleDropdown = (name) => {
    if (this.state.dropdownOpen && this.state.dropdownOpen === name) {
      this.setState({ dropdownOpen: null });
    } else {
      this.setState({ dropdownOpen: name });
    }
  };

  setStateValue = (params) => {
    this.setState(params);
  };
  
  getCanvasChartSpacing() {
    let state = this.state;
    let canvas = document.querySelector(".canvas-area");
    // let    chart = document.querySelector('#chart');

    let styles = {};

    if (canvas.clientWidth > state.svg_chart_width) {
      styles.inset = `10px 0 10px ${(canvas.clientWidth - state.svg_chart_width) / 2
        }px`;
    } else {
      styles.inset = `10px 0 10px 0`;
    }

    let scrollBarWidth = canvas.offsetWidth - canvas.clientWidth,
      scrollBarHeight = canvas.offsetHeight - canvas.clientHeight;

    if (scrollBarWidth <= 0) {
      scrollBarWidth = canvas.clientWidth;
    }

    if (scrollBarHeight <= 0) {
      scrollBarHeight = canvas.clientHeiscrollBarHeight;
    }

    let mw = (canvas.scrollWidth - canvas.clientWidth) / canvas.scrollWidth,
      mh = (canvas.scrollHeight - canvas.clientHeight) / canvas.scrollHeight,
      offsetLeft = canvas.scrollLeft / canvas.scrollWidth,
      offsetTop = canvas.scrollTop / canvas.scrollHeight;

    mw = 168 - 168 * mw;
    mh = 119 - 119 * mh;
    offsetLeft = 168 * offsetLeft;
    offsetTop = 119 * offsetTop;

    // console.log(mw);

    mw = mw > 5 ? mw : 5;
    mh = mh > 5 ? mh : 5;
    if (offsetLeft <= 15) {
      offsetLeft = 15;
    }
    if (offsetTop <= 15) {
      offsetTop = 15;
    }

    if (offsetLeft > 200 - 15) {
      offsetLeft = 200 - 15;
    }
    if (offsetTop > 149 - 15) {
      offsetTop = 149 - 15;
    }

    this.setState({
      minchart_style: {
        width: `${mw}px`,
        height: `${mh}px`,
        left: offsetLeft,
        top: offsetTop,
      },
      svg_chart_styles: styles,
    });

    // this.dragElement(document.getElementById('picture-in-picture-handle'));
  }

  toggleFullScreen = () => {
    let isFullScreen = this.state.isFullScreen;

    this.setState({ isFullScreen: !isFullScreen });

    setTimeout(() => {
      this.getCanvasChartSpacing();
    }, 10);
  };

  UNSAFE_componentWillUpdate = async (nextProps, nextState) => {
    if (!this.state.loading) {
      // console.log('nextState', nextState);
      // this.setState({ save_status: true });
      let { chartId } = this.props.match.params;
      let json = {
        chart_id: chartId,
        product: "FC",
        is_template: nextState.chart.is_template,
        // "is_starred": false,
        pages_id: nextState.chart.pages_id,
        chart: nextState.nodes,
        page_name: nextState.pages
          ? nextState.pages[nextState.currentPage - 1].page_name
          : "Page 1",
        chart_name: nextState.chart_name,
      };
      let response = await addUpdateChart(json);
      if (response.success) {
        // this.setState({ save_status: false });
        console.log("Data updated");
      }
    }
  };

  saveUndoProcess = (params, delete_redo = true) => {
    let { undo_process } = this.state;

    undo_process.push(params);

    this.setState({ undo_process });

    if (delete_redo) {
      this.setState({ redo_process: [] });
    }

    return undo_process;
  };

  saveTemplate = async () => {
    let data = this.state.chartdetails.data;
    data.is_template = true;
    // console.log('chartdetails', data);
    let response = await addUpdateChart(data);
    if (response.success) {
      console.log("response", response);
    }
  };

  async componentDidMount() {
    let userString = localStorage.getItem("user");
    let user = JSON.parse(userString);

    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    let { chartId } = this.props.match.params;
    let chart = await getChartInfo(chartId);

    // console.log('chart', chart);
    // console.log('this.is chart details', chart);

    this.setState({ chartdetails: chart });

    if (!chart.success) {
      this.props.history.push("/");
    }

    let self = this;

    this.setState({
      nodes: chart.data.chart,
      chart_name: chart.data.chart_name ?? "Blank diagram",
      pages: chart.data.pages,
      chart: chart.data,
    });
    if (chart?.data?.chart?.width && chart?.data?.chart?.height) {
      // console.log('width : ', chart.data.chart.width);
      // console.log('height : ', chart.data.chart.height);
      this.setState({
        base_chart_width: chart.data.chart.width,
        base_chart_height: chart.data.chart.height,
      });
      // console.log('state height : ', self.state.base_chart_height);
      // console.log('state width : ', self.state.base_chart_width);
    }

    let shapes = await this.getAllShapes();
    let charts = await this.getAllCharts();

    if (shapes && chart && charts) {
      this.setState({ loading: false });
    }

    let socket = io.connect("/");
    this.setState({ socket });
    let pointerContainer = document.getElementById("pointers");
    let pointer = document.createElement("div");
    pointer.setAttribute("class", "pointer");
    pointer.innerHTML = user.name;
    // console.log('pointer name: ', user.name, pointer);
    let pointers = this.state.pointers;

    document.body.onmousemove = (e) => {
      socket.emit("mousemove", {
        x: e.pageX,
        y: e.pageY,
        drawing: true,
        user: user.name,
      });
    };

    let clients = this.state.clients;
    socket.on("moving", function (data) {
      if (!clients.hasOwnProperty(data.id)) {
        pointers[data.id] = pointerContainer.appendChild(pointer.cloneNode());
      }

      pointers[data.id].style.left = data.x + "px";
      pointers[data.id].style.top = data.y + "px";

      pointers[data.id].innerHTML = data.user;

      clients[data.id] = data;
      self.setState({ clients, pointers });
    });

    socket.on("node_changed", function (nodes) {
      self.setState({ nodes });
    });

    socket.on("clientdisconnect", function (id) {
      delete clients[id];
      if (pointers[id]) {
        pointers[id].parentNode.removeChild(pointers[id]);
      }
      self.setState({ clients, pointers });
    });

    let response = await getFlowchart(this.state.chart.pages_id);
    this.setState({ workflows: response.data });
  }

  componentWillUnmount() {
    let { socket } = this.state;

    socket.disconnect();
  }

  render() {
    // console.log(this.state.speakText, this.state.fromlang, "response data");
    console.log("🚀 ~ nodes ~ this.state.nodes", this.state.nodes)

    let canvasClass = "canvas-screen";
    if (this.state.isFullScreen) {
      canvasClass += " is-full-screen";
    }

    if (this.state.workflowsStart) {
      canvasClass += " workflow-screen";
    }

    if (this.state.loading) {
      return <></>;
    } else {
      return (
        <div className={canvasClass}>
          <div id="pointers"></div>
          {!this.state.workflowsStart ? (
            <>
              <CanvasHeader
                chartName={this.state.chart_name}
                chart={this.state.chart}
                nodes={this.state.nodes}
                updateChartName={(name) => this.setState({ chart_name : name})}
                saveStatus={this.state.save_status}
                saveTemplate={() => this.saveTemplate()}
              />
              <CanvasMenu
                state={this.state}
                setStateValue={(params) => this.setStateValue(params)}
              />
            </>
          ) : (
            <>
              <div className="flowchart-back-button">
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => this.backToCanvas()}
                >
                  Back
                </button>
              </div>
            </>
          )}
          <div className="d-flex chart-main-content">
            {!this.state.workflowsStart ? (
              <CanvasLeftSidebar
                state={this.state}
                setStateValue={(params) => this.setStateValue(params)}
              />
            ) : (
              <></>
            )}
            <CanvasArea
              state={this.state}
              setStateValue={(params) => this.setStateValue(params)}
              saveUndoProcess={(nodes) => this.saveUndoProcess(nodes)}
            />
            <CanvasRightSidebar
              state={this.state}
              setStateValue={(params) => this.setStateValue(params)}
              toggleFullScreen={() => this.toggleFullScreen()}
              activeWorkflow={(e, id) => this.enterWorkflow(e, id)}
              playWorkflow={(e, id) => this.playWorkflow(e, id)}
              handleVoice={(e) => this.handleVoice(e, "voice")}
              handleVolume={(e) => this.handleVolume(e, "volume")}
              handleToLanguage={(e) => this.handleToLanguage(e, "lang")}
              handleFromLanguage={(e) => this.handleFromLanguage(e, "lang")}
              playPauseWorkflow={(e, status = true) =>
                this.playPauseWorkflow(e, status)
              }
            />
          </div>
          <CanvasFooter
            state={this.state}
            setStateValue={(params) => this.setStateValue(params)}
          />
        </div>
      );
    }
  }
}

export default Canvas;
