import React, { Component } from "react";
import { addUpdateChart } from "../../Api/chart.api";
import { addUpdateFlowchart, getFlowchart } from "../../Api/flowchart.api";
import { Modal, Button, Row, Col } from "react-bootstrap";

export default class CanvasRightSidebar extends Component {
  state = {
    flowchartPopupOpen: false,
    formData: {
      name: "",
      description: "",
    },
    workflows: [],
    showModal: false,
    options: [],
  };

  activeWorkflow = (e, id) => {
    // e.preventDefault();
    this.props.activeWorkflow(id);
  };
  playWorkflow = (e, id) => {
    // e.preventDefault();
    this.props.playWorkflow(id);
  };

  handleVoice = (e) => {
    this.props.handleVoice(e);
  };

  handleVolume = (e) => {
    this.props.handleVolume(e);
  };

  requestOptions = {
    method: "GET",
    headers: { accept: "application/json" },
  };

  componentDidMount() {
    fetch("https://libretranslate.de/languages", this.requestOptions)
      .then((response) => response.json())
      .then((opt) => {
        this.setState({ options: opt });
      });
  }

  changeToLanguage = (e) => {
    this.props.handleToLanguage(e);
  };

  changeFromLanguage = (e) => {
    this.props.handleFromLanguage(e);
  };

  playPauseWorkflow = (e) => {
    this.props.playPauseWorkflow(e);
  };
  showModal = () => {
    this.setState({ showModal: true });
  };
  closeModal = () => {
    this.setState({ showModal: false });
  };

  handleInput = (e, feild) => {
    let formData = this.state.formData;
    formData[feild] = e.target.value;
    this.setState({ formData });
    console.log(this.state.formData, "formdata");
  };

  toggleFlowChart = (e) => {
    e.preventDefault();
    document.getElementById("flowchart-popup").classList.toggle("shown");
  };

  // handleSpeechOptions = (value, field) => {
  //     this.props.state.speechOptions[field] = value;

  //     switch (field) {
  //         case 'volume':
  //             this.props.state.speech.setVolume(value);
  //             break;

  //         case 'lang':
  //             this.props.state.speech.setLanguage(value);
  //             break;

  //         case 'voice':
  //             this.props.state.speech.setVoice(value);
  //             break;

  //         default:
  //             break;
  //     }

  //     this.props.setStateValue({ speechOptions: value });
  // }

  creatFlowchart = async (e) => {
    e.preventDefault();
    let state = this.props.state;
    let { name, description } = this.state.formData;
    var data = {
      workflow_id: null,
      pages_id: state.chart.pages_id,
      workflow_name: name,
      workflow_description: description,
      workflow: state.workflowShapes,
      is_active: true,
    };
    let response = await addUpdateFlowchart(data);

    this.setState({
      workflows: response.data.data,
      formData: {
        name: "",
        description: "",
      },
    });

    this.props.setStateValue({
      workflowShapes: [],
      workflows: response.data.data,
    });

    document.getElementById("flowchart-popup").classList.remove("shown");
  };

  deleteWorkflow = async (row) => {
    var data = {
      workflow_id: row.workflow_id,
      pages_id: row.pages_id,
      workflow_name: row.workflow_name,
      workflow_description: row.workflow_description,
      workflow: row.workflow,
      is_active: false,
    };
    let response = await addUpdateFlowchart(data);
    this.setState({
      workflows: response.data.data,
      showModal: false,
      formData: {
        name: "",
        description: "",
      },
    });

    this.props.setStateValue({
      workflows: response.data.data,
    });
    console.log(this.props.state.workflows, "workflow deleted");
  };

  goToIndex = (type) => {
    let { workflowIndex, workflowPlayList } = this.props.state;

    workflowIndex = parseInt(workflowIndex);

    // console.log('current workflow index: ', workflowIndex);
    if (type === "prev" && workflowIndex) {
      workflowIndex--;
    }
    if (type === "next" && workflowIndex < workflowPlayList.length - 1) {
      workflowIndex++;
    }

    // console.log('new workflow index: ', workflowIndex);

    this.props.setStateValue({
      workflowIndex,
    });
    // set timeout removed
    this.props.playPauseWorkflow(type, false);
  };

  render() {
    let state = this.props.state;
    console.log(this.state.options, "options");
    return (
      <>
        <div className="chart-right-sidebar">
          <div>
            <button
              className="btn btn-block"
              onClick={() => {
                this.props.setStateValue({
                  flowchartBoardOpen: !state.flowchartBoardOpen,
                });
              }}
            >
              <i className="icon-play2"></i>
            </button>
            <button className="btn btn-block">
              <i className="icon-stack"></i>
            </button>
            <button className="btn btn-block">
              <i className="icon-display"></i>
            </button>
            <button className="btn btn-block">
              <i className="icon-comment1"></i>
            </button>

            <div
              className={
                !state.flowchartBoardOpen
                  ? "flowchart-board"
                  : "flowchart-board active"
              }
            >
              {state.chart.access_type === "EDIT" ? (
                <button
                  className="btn btn-block btn-primary btn-sm"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => this.props.activeWorkflow(null)}
                >
                  Create new workflow
                </button>
              ) : (
                <></>
              )}

              <ul className="workflow-lists">
                {state.workflows &&
                  state.workflows.length &&
                  state.workflows.map((row, i) => {
                    return (
                      <li>
                        <div className="d-flex">
                          <a
                            href="#"
                            key={i}
                            className="flex-fill workflow-name"
                            onClick={(e) =>
                              this.activeWorkflow(e, row.workflow_id)
                            }
                          >
                            {row.workflow_name}
                          </a>
                          <a
                            className="btn btn-sm btn-primary"
                            onClick={(e) => this.playWorkflow(e, row)}
                          >
                            <i className="icon-play2"></i>
                          </a>
                          {state.chart.access_type === "EDIT" ? (
                            <>
                              <a className="btn btn-sm btn-info">
                                <i className="icon-edit1"></i>
                              </a>
                              <a
                                className="btn btn-sm btn-danger"
                                onClick={() => this.showModal()}
                              >
                                <i className="icon-trash1"></i>
                              </a>
                              <Modal
                                show={this.state.showModal}
                                onHide={() => this.closeModal()}
                              >
                                <Modal.Body style={{ fontWeight: "600" }}>
                                  Are you sure, you want to delete this
                                  workflow?
                                </Modal.Body>
                                <Modal.Footer style={{ textAlign: "center" }}>
                                  <Button
                                    variant="secondary"
                                    onClick={() => this.closeModal()}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="danger"
                                    onClick={() => this.deleteWorkflow(row)}
                                  >
                                    Delete
                                  </Button>
                                </Modal.Footer>
                              </Modal>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-block"
            onClick={() => this.props.toggleFullScreen()}
          >
            <i
              className={
                !state.isFullScreen ? "icon-fullscreen" : "icon-fullscreen_exit"
              }
            ></i>
          </button>
        </div>
        <div id="flowchart-popup">
          <div
            className="popup-bg"
            onClick={(e) => this.toggleFlowChart(e)}
          ></div>
          <div className="popup-part">
            <div className="popup-body">
              <a
                href="#close"
                className="close"
                onClick={(e) => this.toggleFlowChart(e)}
              >
                &times;
              </a>
              <form method="POST" onSubmit={(e) => this.creatFlowchart(e)}>
                <div className="form-group">
                  <label>Workflow Name</label>
                  <input
                    name="name"
                    className="form-control"
                    placeholder="Workflow Name"
                    onInput={(e) => this.handleInput(e, "name")}
                  />
                </div>
                <div className="form-group">
                  <label>Workflow Description</label>
                  <textarea
                    rows="5"
                    name="description"
                    className="form-control"
                    placeholder="Workflow Description"
                    onInput={(e) => this.handleInput(e, "description")}
                  ></textarea>
                </div>
                <div>
                  <button type="submit" className="btn btn-primary btn-block">
                    Save Workflow
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {state.workflowsStart && !state.workflowsPlayMode ? (
          <div className="flowchart-save-btn">
            <button
              className="btn btn-primary"
              onClick={(e) => this.toggleFlowChart(e)}
            >
              Save &amp; Update
            </button>
          </div>
        ) : (
          <></>
        )}
        {state.workflowsStart && state.workflowsPlayMode ? (
          <div className="flex-container flowchart-save-btn workflow-btn-group">
            <div>
              <button
                type="button"
                title={!state.workflowsPaused ? "Play" : "Pause"}
                onClick={(e) => this.playPauseWorkflow(e)}
              >
                {
                  <i
                    className={
                      !state.workflowsPaused ? "icon-play3" : "icon-pause"
                    }
                  ></i>
                }
              </button>
            </div>
            <div>
              <button
                type="button"
                title="Previous"
                disabled={!state.workflowIndex}
                onClick={() => this.goToIndex("prev")}
              >
                <i className="icon-skip_previous"></i>
              </button>
            </div>
            <div>
              <button
                type="button"
                title="Next"
                disabled={
                  state.workflowIndex === state.workflowPlayList.length - 1
                }
                onClick={() => this.goToIndex("next")}
              >
                <i className="icon-skip_next"></i>
              </button>
            </div>
            <div>
              <input
                type="range"
                min="0"
                max="1"
                value={this.props.state.speechOptions.volume}
                step="0.1"
                onChange={(e) => this.handleVolume(e, "volume")}
              />
            </div>
            <div>
              <span style={{ color: '#ffffff' }}>Voice : </span>
              <select
                id="narator-list"
                value={this.props.state.speechOptions.voice}
                onChange={(e) => this.handleVoice(e, "voice")}
              >
                <option value="Google UK English Female">Female</option>
                <option value="Google UK English Male">Male</option>
              </select>
            </div>
            <div>
              <span style={{ color: '#ffffff' }}>From : </span>
              <select id="lang-list" onChange={(e) => this.changeFromLanguage(e)}>
                {this.state.options.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span style={{ color: '#ffffff' }}>To : </span>
              <select id="lang-list" onChange={(e) => this.changeToLanguage(e)}>
                {this.state.options.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
}
