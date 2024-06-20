import React, { Component } from "react";
import ContextMenu from "../../Components/ContextMenu.js";
import ConnectorContextMenu from "../../Components/ConnectorContextMenu.js";
import EditorPopup from "../../Components/EditorPopup.js";
import FlowchartConnector from "../../Components/FlowchartConnector.js";
import FlowchartResizeNode from "../../Components/FlowchartResizeNode.js";
import ShapePopup from "./ShapePopup.js";
import { InputGroup } from "react-bootstrap";
import TextEditorPopup from "../TextEditorPopup.js";
import SelectionMenu from "../SelectionMenu.js";
import { addUpdateTemplets } from "../../Api/chart.api.js";
import ContextMultiSelectMenu from "../ContextMultiSelectMenu.js";

const audio = new Audio("/sound.wav");
export default class CanvasArea extends Component {
  state = {
    showPopup: null,
    endConnector: 0,
  };
  nodes_changed = (new_nodes) => {
    let { socket } = this.props.state;
    new_nodes.width = this.props.state.svg_chart_width;
    new_nodes.height = this.props.state.svg_chart_height;
    // console.log('new nodes', new_nodes);
    setTimeout(() => {
      this.props.setStateValue({
        nodes: new_nodes,
      });
      socket.emit("state_changed", new_nodes);
    }, 100);
  };
  startSelection = (e) => {
    if (e.target === document.querySelector("#chart svg")) {
      let { x, y } = this.getMousePosition(e);
      // console.log('x', x);
      this.props.setStateValue({
        multiSelection: true,
        multiSelectionStatus: {
          startX: x,
          startY: y,
          width: 0,
          height: 0,
        },
      });
    }
  };

  toggleShapePopup = (x, y) => {
    this.setState({
      showShapePopup: {
        x,
        y,
      },
    });
  };

  saveUndoProcess = (params, delete_redo = true) => {
    let state = this.props.state;
    // let nodes = { ...state.nodes };
    let undo_process = state.undo_process ?? [];

    // console.log('undo nodes: ', params);

    undo_process.push({ ...params });

    this.props.setStateValue({ undo_process });

    if (delete_redo) {
      this.props.setStateValue({ redo_process: [] });
    }

    return undo_process;
  };
  saveRedoProcess = (params) => {
    let state = this.props.state;
    let redo_process = state.redo_process;
    redo_process.push(params);

    this.props.setStateValue({ redo_process });
  };
  selectObject = (e, index) => {
    let state = this.props.state;
    let self = this;

    let canvasTag = document.querySelector(".canvas-area");
    let chartTag = document.querySelector("#chart");
    let offsetX = canvasTag.offsetLeft + chartTag.offsetLeft,
      offsetY = canvasTag.offsetTop + chartTag.offsetTop;

    self.props.setStateValue({
      current: {
        index: index,
        x: state.nodes.shapes[index].x,
        y: state.nodes.shapes[index].y,
      },
    });

    if (e.button === 2) {
      self.props.setStateValue({
        showContextMenu: {
          index: index,
          x: e.pageX - offsetX,
          y: e.pageY - offsetY,
        },
      });
    }
  };
  multiselectObject = (e) => {
    let state = this.props.state;
    let self = this;

    let canvasTag = document.querySelector(".canvas-area");
    let chartTag = document.querySelector("#chart");
    let offsetX = canvasTag.offsetLeft + chartTag.offsetLeft,
      offsetY = canvasTag.offsetTop + chartTag.offsetTop;

    // self.props.setStateValue({
    //     current: {
    //         index: index,
    //         x: state.nodes.shapes[index].x,
    //         y: state.nodes.shapes[index].y,
    //     }
    // })

    if (e.button === 2) {
      self.props.setStateValue({
        showContextMultiSelectMenu: {
          x: e.pageX - offsetX,
          y: e.pageY - offsetY,
        },
      });
    }
  };
  getMousePosition = (evt) => {
    var svg = document.querySelector("#chart>svg");
    var CTM = svg.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d,
    };
  };
  getMousePositionConnector = (evt) => {
    let state = this.props.state;
    let { offsetX, offsetY } = state.offset;
    // console.log("selection pos: ", evt.clientX, evt.clientY, 'offset: ', offsetX, offsetY);

    return {
      x: evt.clientX - offsetX,
      y: evt.clientY - offsetY,
    };
  };
  unselectAll = (e) => {
    if (e.target === document.querySelector("#chart svg")) {
      this.props.setStateValue({
        focused: null,
        connectorFocused: null,
        openConnectorContextMenu: null,
      });

      if (this.state.endConnector >= 1) {
        this.setState({ showShapePopup: null, endConnector: 0 });
      }

      this.setState({ endConnector: parseInt(this.state.endConnector) + 1 });
    }
  };
  dragging = async (x, y) => {
    let state = this.props.state;

    if (state.chart.access_type === "EDIT") {
      let nodes = state.nodes;

      if (!nodes.shapes) {
        nodes.shapes = [];
      }

      setTimeout(() => {
        let id = nodes.shapes.length + 1;
        if (state.drag_type !== "fc") {
          let data = {
            id,
            x,
            y,
            name: state.drag_type,
            type: state.drag_type,
            width: 80,
            height: 40,
            stroke: "#bbbbbb",
            strokeWidth: 2,
            fill: "#ffffff",
            dasharray: state.activeDashArray,
            shapeType: 0,
          };
          this.props.saveUndoProcess({
            action: "remove-shape",
            index: nodes.shapes.length,
            data,
          });
          nodes.shapes.push(data);

          for (let index in nodes.shapes) {
            let node = nodes.shapes[index];
            let filtered_shapes = state?.shapes?.filter(
              (s) => s.shape_key === node?.type
            );

            let shapeType = nodes?.shapes[index]?.shapeType;

            shapeType = filtered_shapes[0]?.category === "Flowchart" ? 0 : 1;
          }
        } else {
          console.log("flowchart dropped: ", state.templateChart);
          var shape, connector;
          if (state.templateChart?.chart?.shapes) {
            state.templateChart.chart.shapes.forEach((row) => {
              shape = row;
              nodes.shapes.push(shape);
            });
          }
          if (state.templateChart?.chart?.connector) {
            state.templateChart.chart.connector.forEach((row) => {
              connector = row;
              nodes.connector.push(connector);
            });
          }
        }

        this.nodes_changed(nodes);
      }, 10);
    }
  };
  removeShape = (index) => {
    let state = this.props.state;
    let nodes = state.nodes;

    this.props.saveUndoProcess({
      action: "add-shape",
      index: index,
      data: state.nodes.shapes[index],
      connectors: nodes.connector,
    });

    let nodesConnector = nodes.connector.filter(function (n) {
      return n.shape1_index !== index && n.shape2_index !== index;
    });
    nodes.connector = nodesConnector;

    nodes.shapes.splice(index, 1);

    this.nodes_changed(nodes);
  };
  stopObject = () => {
    this.props.setStateValue({
      current: null,
      resizeDir: null,
      connectorNode: null,
      // connectorDir: null,
      multiSelection: false,
    });

    let state = this.props.state;
    if (state.connectorDir) {
      let nodes = state.nodes;
      let last_connector = nodes.connector[nodes.connector.length - 1];

      if (!last_connector.end_direction) {
        this.setState({
          showShapePopup: {
            x: last_connector.positions[2][2],
            y: last_connector.positions[2][3],
          },
        });
      }

      this.props.setStateValue({ connectorDir: null });
    }
  };
  selectResize = (dir) => {
    let state = this.props.state;
    if (state.focused && state.focused.index) {
      this.props.setStateValue({ resizeDir: dir });

      this.props.saveUndoProcess({
        action: "resize-shape",
        index: state.focused.index,
        data: { ...state.nodes.shapes[state.focused.index] },
      });
    }
  };
  selectConnector = (dir, index) => {
    let state = this.props.state;

    if (!state.workflowsStart && state.chart.access_type === "EDIT") {
      this.props.setStateValue({ connectorDir: dir });
      this.setState({ endConnector: 0 });

      let nodes = state.nodes;
      let start = nodes.shapes[index];

      let positions = null;

      if (dir === "right") {
        positions = [
          [
            start.width + start.x,
            start.y + start.height / 2,
            start.width + start.x + 20,
            start.y + start.height / 2,
          ],
          [
            start.width + start.x + 20,
            start.y + start.height / 2,
            start.width + start.x + 50,
            start.y + start.height / 2,
          ],
          [
            start.width + start.x + 50,
            start.y + start.height / 2,
            start.width + start.x + 70,
            start.y + start.height / 2,
          ],
          [
            start.width + start.x + 50,
            start.y + start.height / 2,
            start.width + start.x + 70,
            start.y + start.height / 2,
          ],
        ];
      }

      if (dir === "left") {
        positions = [
          [
            start.x,
            start.y + start.height / 2,
            start.x - 20,
            start.y + start.height / 2,
          ],
          [
            start.x - 20,
            start.y + start.height / 2,
            start.x - 50,
            start.y + start.height / 2,
          ],
          [
            start.x - 50,
            start.y + start.height / 2,
            start.x - 70,
            start.y + start.height / 2,
          ],
          [
            start.x - 50,
            start.y + start.height / 2,
            start.x - 70,
            start.y + start.height / 2,
          ],
        ];
      }

      if (dir === "top") {
        positions = [
          [
            start.x + start.width / 2,
            start.y,
            start.x + start.width / 2,
            start.y - 20,
          ],
          [
            start.x + start.width / 2,
            start.y - 20,
            start.x + start.width / 2,
            start.y - 50,
          ],
          [
            start.x + start.width / 2,
            start.y - 50,
            start.x + start.width / 2,
            start.y - 70,
          ],
          [
            start.x + start.width / 2,
            start.y - 50,
            start.x + start.width / 2,
            start.y - 70,
          ],
        ];
      }

      if (dir === "bottom") {
        positions = [
          [
            start.x + start.width / 2,
            start.y + start.height,
            start.x + start.width / 2,
            start.y + start.height + 20,
          ],
          [
            start.x + start.width / 2,
            start.y + start.height + 20,
            start.x + start.width / 2,
            start.y + start.height + 50,
          ],
          [
            start.x + start.width / 2,
            start.y + start.height + 50,
            start.x + start.width / 2,
            start.y + start.height + 70,
          ],
          [
            start.x + start.width / 2,
            start.y + start.height + 50,
            start.x + start.width / 2,
            start.y + start.height + 70,
          ],
        ];
      }

      if (!nodes.connector) {
        nodes.connector = [];
      }

      nodes.connector.push({
        start_direction: dir,
        end_direction: null,
        shape1_index: index,
        shape2_index: null,
        positions: positions,
        arrow: state.activeArrow,
        dasharray: state.activeDashArray,
      });

      // this.props.saveUndoProcess({
      //     action: 'move-connector',
      //     index: index,
      //     connector: [...nodes.connector]
      // });

      this.nodes_changed(nodes);
    }

    // this.saveUndoProcess({
    //     action: 'remove-connector',
    //     index: nodes.connector.length - 1,
    //     connector: nodes.connector[nodes.connector.length - 1]
    // });
  };
  moveConnector = (x, y) => {
    let state = this.props.state;

    let nodes = state.nodes;

    this.props.saveUndoProcess({
      action: "move-connector",
      index: nodes.connector.length - 1,
      connector: [...nodes.connector],
    });
    let conn = nodes.connector[nodes.connector.length - 1];

    let start = nodes.shapes[conn.shape1_index];
    let start_dir = conn.start_direction;

    conn.positions[0][2] = x;

    conn.positions[1][0] = x;
    conn.positions[1][2] = x;
    conn.positions[1][3] = y;

    conn.positions[2][0] = x;
    conn.positions[2][1] = y;
    conn.positions[2][2] = x;
    conn.positions[2][3] = y;

    conn.positions[3][0] = x;
    conn.positions[3][1] = y;
    conn.positions[3][2] = x;
    conn.positions[3][3] = y;

    let h = x;

    if (start_dir === "left" && x > start.x - 20) {
      h = start.x - 20;
    }

    if (start_dir === "right" && x < start.x + start.width + 20) {
      h = start.x + start.width + 20;
    }

    if (start_dir === "bottom") {
      h = start.x + start.width / 2;
    }

    if (start_dir === "top") {
      h = start.x + start.width / 2;
    }

    conn.positions[0][2] = h;

    conn.positions[1][0] = h;
    conn.positions[1][2] = h;

    conn.positions[2][0] = h;
    conn.positions[3][0] = h;

    if (Math.abs(conn.positions[3][0] - conn.positions[3][2]) <= 15) {
      conn.positions[3][2] = conn.positions[3][0];
      if (conn.positions[3][1] > conn.positions[0][1])
        conn.positions[3][3] += 5;
      else conn.positions[3][3] -= 5;
    }

    nodes.connector[nodes.connector.length - 1] = conn;

    this.nodes_changed(nodes);
  };
  doneConnection = (dir, index) => {
    let state = this.props.state;
    let nodes = state.nodes;
    if (state.connectorDir) {
      let conn =
        state.connectorFocused && state.connectorFocused.index
          ? nodes.connector[state.connectorFocused.index]
          : nodes.connector[nodes.connector.length - 1];

      if (conn.shape1_index !== index) {
        conn.end_direction = dir;
        conn.shape2_index = index;

        // Play Audio
        audio.play();

        nodes = this.moveConnectorAlong(nodes, index);

        this.props.saveUndoProcess({
          action: "remove-connector",
          index: index,
          connector: [...nodes.connector],
        });

        this.nodes_changed(nodes);

        this.stopObject();
      }
    }
  };
  focusConnector = (e, index) => {
    let state = this.props.state;
    if (!state.workflowsStart && state.chart.access_type === "EDIT") {
      if (e.button === 2) {
        let { x, y } = this.getMousePosition(e);
        this.props.setStateValue({
          openConnectorContextMenu: {
            index: index,
            x,
            y,
          },
        });
      } else {
        this.props.setStateValue({
          connectorFocused: {
            index: index,
          },
        });
      }
    }
    // console.log('focus connector: ', index);
  };
  focusObject = (index) => {
    let state = this.props.state;
    let shape = state.nodes.shapes[index];
    if (!state.workflowsStart && state.chart.access_type === "EDIT") {
      this.props.setStateValue({
        focused: {
          index: index,
          x: shape.x,
          y: shape.y,
        },
      });

      document.getElementById("fillColorSelector").value = shape.fill;
      document.getElementById("strokeColorSelector").value = shape.stroke;
      document.getElementById("strokeWidthSelector").value = shape.strokeWidth;
    } else {
      state.workflowShapes.push(shape.id);
      this.props.setStateValue({ workflowShapes: state.workflowShapes });
    }
  };
  moveConnectorAlong = (nodes, index) => {
    // connector moving with object
    let nodesConnector = nodes.connector
      ? nodes.connector.filter(function (n) {
          return n.shape1_index === index || n.shape2_index === index;
        })
      : [];
    nodesConnector.forEach((row, i) => {
      let conn = row;
      let start = nodes.shapes[conn.shape1_index];
      let end = nodes.shapes[conn.shape2_index];

      var startCY = start.y + start.height / 2,
        startCX = start.x + start.width / 2,
        startLX = start.x,
        startTY = start.y,
        startRX = start.x + start.width,
        startBY = start.y + start.height,
        endCY = end.y + end.height / 2,
        endCX = end.x + end.width / 2,
        endLX = end.x,
        endTY = end.y,
        endRX = end.x + end.width,
        endBY = end.y + end.height;

      /**Start Node */
      if (conn.start_direction === "top") {
        conn.positions[0][0] = startCX;
        conn.positions[0][1] = startTY;
        conn.positions[0][2] = startCX;
        conn.positions[0][3] = startTY - 60;

        conn.positions[1][0] = startCX;
        conn.positions[1][1] = startTY - 60;
        conn.positions[1][2] =
          start.y > end.y
            ? conn.positions[1][0]
            : conn.positions[1][0] + start.width + 60;
        conn.positions[1][3] = startTY - 60;
      }

      if (conn.start_direction === "right") {
        conn.positions[0][0] = startRX;
        conn.positions[0][1] = startCY;
        conn.positions[0][2] = startRX + 60;
        conn.positions[0][3] = startCY;

        conn.positions[1][0] = startRX + 60;
        conn.positions[1][1] = startCY;
        conn.positions[1][2] = conn.positions[1][0];
        conn.positions[1][3] = startCY;
      }

      if (conn.start_direction === "bottom") {
        conn.positions[0][0] = startCX;
        conn.positions[0][1] = startBY;
        conn.positions[0][2] = startCX;
        conn.positions[0][3] = startBY + 60;

        conn.positions[1][0] = startCX;
        conn.positions[1][1] = startBY + 60;
        conn.positions[1][2] =
          start.y < end.y
            ? conn.positions[1][0]
            : conn.positions[1][0] + start.width + 60;
        conn.positions[1][3] = startBY + 60;
      }

      if (conn.start_direction === "left") {
        conn.positions[0][0] = startLX;
        conn.positions[0][1] = startCY;
        conn.positions[0][2] = startLX - 60;
        conn.positions[0][3] = startCY;

        conn.positions[1][0] = startLX - 60;
        conn.positions[1][1] = startCY;
        conn.positions[1][2] = conn.positions[1][0];
        conn.positions[1][3] = startCY;
      }

      /** End Node */
      if (conn.end_direction === "top") {
        conn.positions[2][0] = conn.positions[1][2];
        conn.positions[2][1] = endTY - 60;
        conn.positions[2][2] = endCX;
        conn.positions[2][3] = endTY - 60;

        conn.positions[3][0] = endCX;
        conn.positions[3][1] = endTY - 60;
        conn.positions[3][2] = endCX;
        conn.positions[3][3] = endTY;

        // if(conn.positions[3][3] > conn.positions[1][1]) {
        //     // conn.positions[1][3] = conn.positions[3][1];
        //     conn.positions[2][1] = conn.positions[1][1];
        // }
      }

      if (conn.end_direction === "right") {
        conn.positions[2][0] = conn.positions[1][2];
        conn.positions[2][1] = endCY;
        conn.positions[2][2] = end.x + end.width + 60;
        conn.positions[2][3] = endCY;

        conn.positions[3][0] = endRX + 60;
        conn.positions[3][1] = endCY;
        conn.positions[3][2] = endRX;
        conn.positions[3][3] = endCY;

        if (conn.positions[3][0] > conn.positions[1][0]) {
          conn.positions[1][2] = conn.positions[3][0];
          conn.positions[2][0] = conn.positions[3][0];
        }
      }

      if (conn.end_direction === "bottom") {
        conn.positions[2][0] = conn.positions[1][2];
        conn.positions[2][1] = endBY + 60;
        conn.positions[2][2] = endCX;
        conn.positions[2][3] = endBY + 60;

        conn.positions[3][0] = endCX;
        conn.positions[3][1] = endBY + 60;
        conn.positions[3][2] = endCX;
        conn.positions[3][3] = endBY;
      }

      if (conn.end_direction === "left") {
        conn.positions[2][0] = conn.positions[1][2];
        conn.positions[2][1] = endCY;
        conn.positions[2][2] = endLX - 60;
        conn.positions[2][3] = endCY;

        conn.positions[3][0] = endLX - 60;
        conn.positions[3][1] = endCY;
        conn.positions[3][2] = endLX;
        conn.positions[3][3] = endCY;

        if (conn.positions[3][0] < conn.positions[1][0]) {
          conn.positions[1][2] = conn.positions[3][0];
          conn.positions[2][0] = conn.positions[3][0];
        }
      }
    });

    return nodes;
  };
  moveObject = (x, y) => {
    let state = this.props.state;

    if (!state.workflowsStart && state.chart.access_type === "EDIT") {
      var index;

      let nodes = state.nodes;
      if (
        state.current &&
        !state.resizeDir &&
        !state.connectorDir &&
        !state.connectorNode &&
        !state.multiSelection
      ) {
        index = state.current.index;

        // console.log('move object', x, y);

        if (x <= 90) {
          x = 90;
        }
        if (y <= 60) {
          y = 60;
        }
        if (x >= state.base_chart_width - 40) {
          x = state.base_chart_width - 40;
        }
        if (y >= state.base_chart_height - 40) {
          y = state.base_chart_height - 40;
        }

        nodes.shapes[index].x = x - 60;
        nodes.shapes[index].y = y - 30;
        // console.log('connector:', nodes.connector);
        // var data = nodes.shapes[index]? { ...nodes.shapes[index] }: null;

        var connector = nodes.connector ? [...nodes.connector] : [];
        var data = { ...nodes.shapes[index] };
        if (nodes.shapes[index]) {
          this.props.saveUndoProcess({
            action: "move-shape",
            index: index,
            data,
            connector,
          });
        }

        nodes = this.moveConnectorAlong(nodes, index);

        this.nodes_changed(nodes);
      } else if (state.multiSelection && state.multiSelectionStatus) {
        // console.log('pos: ', x, y);
        let multiSelectionStatus = state.multiSelectionStatus;
        multiSelectionStatus.width = x - multiSelectionStatus.startX;
        multiSelectionStatus.height = y - multiSelectionStatus.startY;
        // this.startSelection(document.querySelector('#chart>svg'));
        this.props.setStateValue({
          multiSelectionStatus,
        });
      } else if (state.connectorNode) {
        let { index, index2, type } = state.connectorNode;

        if (type === "h") {
          nodes.connector[index].positions[index2][0] = x;
          nodes.connector[index].positions[index2][2] = x;
        } else {
          nodes.connector[index].positions[index2][1] = y;
          nodes.connector[index].positions[index2][3] = y;
        }

        this.nodes_changed(nodes);
      } else if (state.connectorDir && nodes.connector.length) {
        this.moveConnector(x, y);
      } else if (state.focused && state.resizeDir) {
        index = state.focused.index;

        switch (state.resizeDir) {
          case "bottom":
            nodes.shapes[index].height =
              y - nodes.shapes[index].y > 30 ? y - nodes.shapes[index].y : 30;
            break;

          case "top":
            if (
              state.nodes.shapes[index].y +
                state.nodes.shapes[index].height -
                y >
              30
            ) {
              nodes.shapes[index].height =
                state.nodes.shapes[index].y +
                  state.nodes.shapes[index].height -
                  y >
                30
                  ? state.nodes.shapes[index].y +
                    state.nodes.shapes[index].height -
                    y
                  : 30;
              nodes.shapes[index].y = y;
            }
            break;

          case "left":
            if (
              state.nodes.shapes[index].x +
                state.nodes.shapes[index].width -
                x >
              60
            ) {
              nodes.shapes[index].width =
                nodes.shapes[index].x + nodes.shapes[index].width - x > 60
                  ? nodes.shapes[index].x + nodes.shapes[index].width - x
                  : 60;
              nodes.shapes[index].x = x;
            }
            break;

          case "right":
            nodes.shapes[index].width =
              x - nodes.shapes[index].x > 60 ? x - nodes.shapes[index].x : 60;
            break;

          case "left-top":
            if (
              state.nodes.shapes[index].x +
                state.nodes.shapes[index].width -
                x >
              60
            ) {
              nodes.shapes[index].width =
                nodes.shapes[index].x + nodes.shapes[index].width - x > 60
                  ? nodes.shapes[index].x + nodes.shapes[index].width - x
                  : 60;
              nodes.shapes[index].x = x;
            }
            if (
              state.nodes.shapes[index].y +
                state.nodes.shapes[index].height -
                y >
              30
            ) {
              nodes.shapes[index].height =
                nodes.shapes[index].y + nodes.shapes[index].height - y > 30
                  ? nodes.shapes[index].y + nodes.shapes[index].height - y
                  : 30;
              nodes.shapes[index].y = y;
            }
            break;

          case "right-top":
            nodes.shapes[index].width =
              x - nodes.shapes[index].x > 60 ? x - nodes.shapes[index].x : 60;
            if (
              state.nodes.shapes[index].y +
                state.nodes.shapes[index].height -
                y >
              30
            ) {
              nodes.shapes[index].height =
                nodes.shapes[index].y + nodes.shapes[index].height - y > 30
                  ? nodes.shapes[index].y + nodes.shapes[index].height - y
                  : 30;
              nodes.shapes[index].y = y;
            }
            break;

          case "left-bottom":
            if (
              state.nodes.shapes[index].x +
                state.nodes.shapes[index].width -
                x >
              60
            ) {
              nodes.shapes[index].width =
                nodes.shapes[index].x + nodes.shapes[index].width - x > 60
                  ? nodes.shapes[index].x + nodes.shapes[index].width - x
                  : 60;
              nodes.shapes[index].x = x;
            }
            nodes.shapes[index].height =
              y - nodes.shapes[index].y > 30 ? y - nodes.shapes[index].y : 30;
            break;

          case "right-bottom":
            nodes.shapes[index].width =
              x - nodes.shapes[index].x > 60 ? x - nodes.shapes[index].x : 60;
            nodes.shapes[index].height =
              y - nodes.shapes[index].y > 30 ? y - nodes.shapes[index].y : 30;
            break;

          default:
            break;
        }

        nodes = this.moveConnectorAlong(nodes, index);

        this.nodes_changed(nodes);
      }
    }
  };

  handleConnectionContext = (side, index) => {
    let state = this.props.state;
    let nodes = state.nodes;
    if (side === "delete") {
      // console.log('sdf sijoidjfdioj ois sij oisdfj');

      this.props.saveUndoProcess({
        action: "add-connector",
        index: index,
        connector: [...nodes.connector],
      });
      nodes.connector.splice(index, 1);
    }

    this.nodes_changed(nodes);

    this.props.setStateValue({ openConnectorContextMenu: null });
  };

  copyShape = async (index) => {
    let state = this.props.state;
    let nodes = state.nodes;
    let shape = { ...nodes.shapes[index] };
    shape.x += 100;
    nodes.shapes[nodes.shapes.length] = shape;
    // let data = {
    //     chart: nodes,
    //     title: 'this is template'
    // }
    // let response = await addUpdateTemplets(data);

    this.props.saveUndoProcess({
      action: "remove-shape",
      index: nodes.shapes.length - 1,
      data: shape,
    });

    this.nodes_changed(nodes);
  };

  handleGoTo(side, index) {
    let state = this.props.state;
    let selected;
    let nodes = state.nodes;
    if (side === "copy") {
      this.copyShape(index);
    }
    if (side === "paste") {
      this.copyShape(index);
    } else {
      if (side === "delete") {
        this.removeShape(index);
      } else {
        // console.log('nodes : ',nodes);
        selected = nodes.shapes[index];
        nodes.shapes.splice(index, 1);
        if (side === "front") {
          nodes.shapes.push(selected);
        } else {
          nodes.shapes.unshift(selected);
        }
      }
    }
    this.nodes_changed(nodes);
  }
  multiselecthandleGoTo(side) {
    let state = this.props.state;
    // console.log('sdjkfsdj', side);
    // console.log('sdjfdhfjdklfjdf', state.multiSelectionStatus);
    let pos = {
      x: 0,
      y: 0,
      y1: 0,
      x1: 0,
    };
    pos.x = state.multiSelectionStatus.startX;
    pos.y = state.multiSelectionStatus.startY;
    pos.x1 =
      state.multiSelectionStatus.startX + state.multiSelectionStatus.width;
    pos.y1 =
      state.multiSelectionStatus.startY + state.multiSelectionStatus.height;
    // console.log('pos', pos);
    // console.log('state.nodes', state.nodes);
    let shapes = [...state.nodes.shapes];
    let connectors = [...state.nodes.connector];
    if (side == "copy") {
      let ids = [],
        newindex = {};
      shapes.forEach((element, i) => {
        ids.push(i);
        newindex[i] = shapes.length;
        let endX = element.x + element.width;
        let endY = element.y + element.height;
        if (
          pos.x <= element.x &&
          pos.y <= element.y &&
          pos.x1 >= endX &&
          pos.y1 >= endY
        ) {
          let nextElement = { ...element };
          nextElement.x += 300;
          shapes.push(nextElement);
        }
      });
      connectors.forEach((conn, j) => {
        let nextConnector = { ...conn };

        nextConnector.shape1_index =
          newindex[nextConnector.shape1_index] ?? null;
        nextConnector.shape2_index =
          newindex[nextConnector.shape2_index] ?? null;

        nextConnector.positions[0][0] += 300;
        nextConnector.positions[0][2] += 300;

        nextConnector.positions[1][0] += 300;
        nextConnector.positions[1][2] += 300;

        nextConnector.positions[2][0] += 300;
        nextConnector.positions[2][2] += 300;

        nextConnector.positions[3][0] += 300;
        nextConnector.positions[3][2] += 300;

        connectors.push(nextConnector);
        // console.log('connetor', connectors);
      });
    }
    state.nodes.shapes = shapes;
    state.nodes.connector = connectors;
    // console.log('state nodes', state.nodes);
    this.nodes_changed(state.nodes);
    this.props.setStateValue({ multiSelectionStatus: null });
  }
  openEditorPop(i) {
    let state = this.props.state;
    if (!state.workflowsStart && state.chart.access_type === "EDIT")
      this.props.setStateValue({
        showEditorPopup: { index: i, node: state.nodes.shapes[i] },
      });
  }
  openTextEditorPop(i) {
    let state = this.props.state;
    if (!state.workflowsStart && state.chart.access_type === "EDIT")
      this.props.setStateValue({
        showTextEditorPopup: { index: i, node: state.nodes.shapes[i] },
      });
  }
  closeTextEditorPopup() {
    this.props.setStateValue({ showTextEditorPopup: false });
  }
  closeEditorPopup() {
    this.props.setStateValue({ showEditorPopup: false });
  }
  saveCanvas(node, i) {
    let state = this.props.state;
    // console.log('saved node: ', node);
    let nodes = state.nodes;
    nodes.shapes[i] = node;

    // console.log('node: ', node);

    this.nodes_changed(nodes);
  }
  onDeletePress = (e) => {
    let state = this.props.state;
    let nodes = state.nodes;
    if (e.keyCode === 46 || e.keyCode === 8) {
      if (state.focused) {
        this.removeShape(state.focused.index);
      }

      if (state.connectorFocused) {
        this.props.saveUndoProcess({
          action: "add-connector",
          index: state.connectorFocused.index,
          connector: [...nodes.connector],
        });

        nodes.connector.splice(state.connectorFocused.index, 1);
        this.nodes_changed(nodes);
      }
    }
  };
  onCopyPress = (e) => {
    let state = this.props.state;
    let nodes = state.nodes;
    if (state.focused) {
      this.copyShape(state.focused.index);
    }
  };
  selectConnectorNode = (pos) => {
    let { state } = this.props;
    let nodes = state.nodes;
    let index = pos.index;

    if (pos.type === "conn3_end") {
      this.props.setStateValue({
        connectorDir: nodes.connector[index].start_direction,
      });
    }

    this.props.saveUndoProcess({
      action: "move-connector",
      index: index,
      connector: [...nodes.connector],
    });

    this.props.setStateValue({
      connectorNode: pos,
    });
  };
  canvasFeatures = (elmnt) => {
    let state = this.props.state;

    if (!state.workflowsStart && state.chart.access_type === "EDIT") {
      var shape = document.querySelector("#chart > svg");

      if (shape) {
        shape.onmousedown = moveObject;
      } else {
        elmnt.onmousedown = moveObject;
      }

      elmnt.ondrop = dropped;
    }

    let self = this;

    function getMousePosition(evt) {
      var svg = document.querySelector(`#chart>svg`);
      var CTM = svg.getScreenCTM();
      return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d,
      };
    }

    function dropped(e) {
      var { x, y } = getMousePosition(e);
      self.dragging(x, y);
    }

    function moveObject(e) {
      e = e || window.event;
      e.preventDefault();
      document.onmouseup = closeDragElement;

      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();

      var { x, y } = getMousePosition(e);

      self.moveObject(x, y);
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  };
  findDirection = (start_dir, positions) => {
    let endDir = "left";
    if (start_dir === "left" || start_dir === "right") {
      if (positions[0][1] > positions[2][1]) {
        endDir = "bottom";
      } else if (positions[0][1] < positions[2][1]) {
        endDir = "top";
      } else if (positions[0][0] > positions[2][0]) {
        endDir = "left";
      } else {
        endDir = "right";
      }
    }

    if (start_dir === "top" || start_dir === "bottom") {
      if (
        positions[0][1] > positions[2][1] &&
        positions[0][0] === positions[2][0]
      ) {
        endDir = "bottom";
      } else if (
        positions[0][1] < positions[2][1] &&
        positions[0][0] === positions[2][0]
      ) {
        endDir = "top";
      } else if (positions[0][0] > positions[2][0]) {
        endDir = "left";
      } else {
        endDir = "right";
      }
    }
    // console.log('end dire: ', endDir);
    return endDir;
  };
  increaseCanvasArea = (side) => {
    let self = this;
    // console.log('side: ', side);
    let nodes = this.props.state.nodes;
    // console.log('nodes data', nodes);
    if (side === "right" || side === "left") {
      let width = this.props.state.base_chart_width + 842;
      this.props.setStateValue({ base_chart_width: width });
      this.props.setStateValue({
        other_w_chart: this.props.state.other_w_chart + 1,
      });

      this.nodes_changed(nodes);
    }
    if (side === "top" || side === "bottom") {
      let height = this.props.state.base_chart_height + 595;
      this.props.setStateValue({ base_chart_height: height });
      this.props.setStateValue({
        other_h_chart: this.props.state.other_h_chart + 1,
      });

      this.nodes_changed(nodes);
    }
    if (side === "left") {
      for (let key in nodes.shapes) {
        nodes.shapes[key].x += 842;
      }
      let pos;
      for (let index in nodes.connector) {
        pos = nodes.connector[index].positions;
        pos.forEach((p) => {
          p[0] += 842;
          p[2] += 842;
        });
      }
      this.nodes_changed(nodes);
    }
    if (side === "top") {
      for (let key in nodes.shapes) {
        nodes.shapes[key].y += 595;
      }
      let pos;
      for (let index in nodes.connector) {
        pos = nodes.connector[index].positions;
        pos.forEach((p) => {
          p[1] += 595;
          p[3] += 595;
        });
      }
      this.nodes_changed(nodes);
    }

    setTimeout(() => {
      let { base_chart_width, base_chart_height, zoom } = self.props.state;
      this.props.setStateValue({
        svg_chart_width: base_chart_width + (base_chart_width * zoom) / 100,
        svg_chart_height: base_chart_height + (base_chart_height * zoom) / 100,
      });
      self.props.setStateValue({
        base_chart_viewbox: `0 0 ${base_chart_width} ${base_chart_height}`,
      });
    }, 100);
  };
  componentWillUnmount() {
    document.removeEventListener("keydown", this.onDeletePress, false);
    document.removeEventListener("keydown", this.onCopyPress, false);
  }
  componentDidMount() {
    let self = this;
    document.addEventListener("keydown", this.onDeletePress, false);
    // document.addEventListener('keydown', this.onCopyPress, false);
    this.canvasFeatures(document.querySelector("#chart"));

    var ctrlDown = false,
      ctrlKey = 17,
      cmdKey = 91,
      vKey = 86,
      cKey = 67;

    // $(document).keydown(function(e) {
    //     if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
    // }).keyup(function(e) {
    //     if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
    // });

    document.addEventListener(
      "keydown",
      function (e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
      },
      false
    );

    document.addEventListener(
      "keyup",
      function (e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
      },
      false
    );

    document.addEventListener(
      "keydown",
      function (e) {
        if (ctrlDown && e.keyCode == cKey) {
          self.onCopyPress();
        }
      },
      false
    );
  }
  int(val) {
    // console.log(val);
    return Math.round(val);
  }
  render() {
    let state = this.props.state;
    let self = this;
    let h_scr = 0;
    let w_scr = 0;
    let h_array = [];
    if (this.props.state.other_h_chart !== 1) {
      for (let index = 0; index < this.props.state.other_h_chart; index++) {
        h_array[index] = index;
      }
    }
    if (this.props.state.other_h_chart !== 1) {
      h_scr =
        this.props.state.svg_chart_height / this.props.state.other_h_chart;
      // console.log('height', this.props.state.svg_chart_height, h_scr, this.props.state.other_h_chart);
    }
    if (this.props.state.other_w_chart !== 1) {
      // console.log('width', this.props.state.svg_chart_width, this.props.state.other_w_chart);
      w_scr =
        this.int(this.props.svg_chart_width) / this.props.state.other_w_chart;
      // console.log('width', w_scr);
    }
    // console.log('chart details', state);

    return (
      <div className="canvas-area">
        <div
          className="flex-fill"
          style={{
            ...state.svg_chart_styles,
            width: state.chart
              ? state.chart.chart.width
                ? state.chart.chart.width
                : state.svg_chart_width
              : state.svg_chart_width,
            height: state.chart
              ? state.chart.chart.height
                ? state.chart.chart.height
                : state.svg_chart_height
              : state.svg_chart_height,
          }}
          id="chart"
          onDragOver={(e) => {
            e.preventDefault();
          }}
          // onDrop={e => { self.dragging(e) }}
          onMouseDown={(e) => {
            if (e.button !== 2)
              self.props.setStateValue({ showContextMenu: false });
          }}
          onClick={(e) => self.unselectAll(e)}
        >
          <div
            className="increase-area top"
            onClick={() => self.increaseCanvasArea("top")}
          >
            <i className="icon-plus-circle"></i>
          </div>
          <div
            className="increase-area right"
            onClick={() => self.increaseCanvasArea("right")}
          >
            <i className="icon-plus-circle"></i>
          </div>
          <div
            className="increase-area bottom"
            onClick={() => self.increaseCanvasArea("bottom")}
          >
            <i className="icon-plus-circle"></i>
          </div>
          <div
            className="increase-area left"
            onClick={() => self.increaseCanvasArea("left")}
          >
            <i className="icon-plus-circle"></i>
          </div>
          <svg
            onMouseDown={self.startSelection}
            onMouseUp={self.stopObject}
            onMouseLeave={self.stopObject}
            // onMouseMove={self.moveObject}
            width={
              state.chart
                ? state.chart.chart.width
                  ? state.chart.chart.width
                  : state.svg_chart_width
                : state.svg_chart_width
            }
            height={
              state.chart
                ? state.chart.chart.height
                  ? state.chart.chart.height
                  : state.svg_chart_height
                : state.svg_chart_height
            }
            viewBox={
              state.chart
                ? state.chart.chart.width
                  ? `0 0 ${state.chart.chart.width} ${state.chart.chart.height}`
                  : state.base_chart_viewbox
                : state.base_chart_viewbox
            }
          >
            <marker
              id="arrow"
              markerUnits="strokeWidth"
              viewBox="0 0 12 12"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#000"></path>
            </marker>
            <marker
              id="squareArrow"
              markerUnits="strokeWidth"
              viewBox="0 0 12 12"
              refX="5"
              refY="6"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <rect
                x="1"
                y="1"
                width="10"
                height="10"
                fill="white"
                stroke="#000"
                strokeWidth="1"
              />
            </marker>
            <marker
              id="squareFillArrow"
              markerUnits="strokeWidth"
              viewBox="0 0 12 12"
              refX="5"
              refY="6"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <rect
                x="1"
                y="1"
                width="10"
                height="10"
                fill="#000"
                stroke="#000"
                strokeWidth="1"
              />
            </marker>
            <marker
              id="circleArrow"
              markerUnits="strokeWidth"
              viewBox="0 0 12 12"
              refX="5"
              refY="6"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <circle
                cx="6"
                cy="6"
                r="5"
                width="10"
                height="10"
                fill="white"
                stroke="#000"
                strokeWidth="1"
              />
            </marker>
            <marker
              id="circleFillArrow"
              markerUnits="strokeWidth"
              viewBox="0 0 12 12"
              refX="5"
              refY="6"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <circle
                cx="6"
                cy="6"
                r="5"
                width="10"
                height="10"
                fill="#000"
                stroke="#000"
                strokeWidth="1"
              />
            </marker>
            {state.nodes &&
              state.nodes.connector &&
              state.nodes.connector.map(function (node, i) {
                let path = "";
                let lastWorkflowShape = null;
                let connClass =
                  state.connectorFocused !== null &&
                  state.connectorFocused.index === i
                    ? "connection focused"
                    : "connection";

                if (state.workflowShapes.length) {
                  let shapeId =
                    state.workflowShapes[state.workflowShapes.length - 1];

                  lastWorkflowShape = state.nodes.shapes.findIndex(
                    (s) => s.id === shapeId
                  );

                  if (node.shape1_index === lastWorkflowShape) {
                    connClass += " focused";
                  }
                  // console.log('connection start index: ', node.shape1_index, connClass, lastWorkflowShape);
                }

                node.positions.forEach(function (row, j) {
                  path += j === 0 ? "M" : "L";
                  path += `${row[0]},${row[1]}L${row[2]},${row[3]}`;
                });
                return (
                  <g
                    className={connClass}
                    key={i}
                    onMouseDown={(e) => self.focusConnector(e, i)}
                  >
                    <path
                      stroke="#000"
                      strokeWidth="15"
                      fill="none"
                      strokeDasharray={node.dasharray}
                      d={path}
                      markerEnd={`url(#${node.arrow})`}
                      style={{ opacity: 0 }}
                    ></path>
                    <path
                      stroke="#000"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={node.dasharray}
                      d={path}
                      markerEnd={`url(#${node.arrow})`}
                    ></path>

                    {state.connectorFocused !== null &&
                    state.connectorFocused.index === i ? (
                      <>
                        {node.positions.map((npos, k) => {
                          if (k > 0 && k < node.positions.length - 1) {
                            return (
                              <rect
                                key={k}
                                style={{
                                  cursor:
                                    npos[1] === npos[3]
                                      ? "ns-resize"
                                      : "ew-resize",
                                }}
                                x={
                                  npos[1] === npos[3]
                                    ? npos[0] + (npos[2] - npos[0]) / 2 - 5
                                    : npos[0] - 5
                                }
                                y={
                                  npos[1] === npos[3]
                                    ? npos[1] - 5
                                    : npos[1] + (npos[3] - npos[1]) / 2 - 5
                                }
                                width="10"
                                height="10"
                                fill="#12640a"
                                stroke="#12640a"
                                onMouseDown={() =>
                                  self.selectConnectorNode({
                                    index: i,
                                    cx: [2, 0],
                                    cy: [2, 1],
                                    type: npos[1] === npos[3] ? "v" : "h",
                                    index2: k,
                                  })
                                }
                              />
                            );
                          } else {
                            return null;
                          }
                        })}
                      </>
                    ) : null}
                  </g>
                );
              })}
            {state?.nodes &&
              state?.nodes?.shapes &&
              state?.nodes?.shapes.map(function (node, i) {
                // console.log('node', node);
                let className = "flowchart-shape";
                if (state?.current && i === state?.current?.index) {
                  className += " selected";
                }
                if (state?.focused && i === state?.focused?.index) {
                  className += " focused";
                }

                if (state?.workflowShapes?.includes(node?.id)) {
                  className += " active";
                }

                let filtered_shapes = state?.shapes?.filter(
                  (s) => s?.shape_key === node?.type
                );
                let s = filtered_shapes[0];

                return (
                  <>
                    {node?.type == "rectangle" || node?.type == "ellipse" ? (
                      <g
                        onMouseDown={(e) => self.selectObject(e, i)}
                        onClick={() => self.focusObject(i)}
                        onMouseOver={() => {
                          self.props.setStateValue({ activeNode: i });
                        }}
                        onMouseLeave={() => {
                          self.props.setStateValue({ activeNode: null });
                        }}
                        id={`svg_obj_${i}`}
                        key={`shape_${i}`}
                        className={className}
                      >
                        {s &&
                          s.shape &&
                          s.shape.length &&
                          s.shape.map((shapeJSON, s_index) => {
                            // let shapeJSON = s.shape;
                            let ShapeTag = shapeJSON.tag;

                            let shape_attr = shapeJSON.attributes,
                              filtered_value,
                              filtered_value2,
                              s_attr = {},
                              s_attr2 = {};

                            if (s.shape_key === node.type) {
                              for (let index in shape_attr) {
                                filtered_value = shape_attr[index].toString();

                                filtered_value = filtered_value
                                  .replace(/\[w\]/gi, node.width)
                                  .replace(/\[h\]/gi, node.height)
                                  .replace(/\[x\]/gi, node.x)
                                  .replace(/\[y\]/gi, node.y)
                                  // Math calculation
                                  .replace(/{(.*?)}/gi, function (r) {
                                    let res_string = r.replace(
                                      /{(.*?)}/gi,
                                      "$1"
                                    );
                                    return eval(res_string);
                                  });

                                s_attr[index] = filtered_value;

                                filtered_value2 = shape_attr[index].toString();

                                filtered_value2 = filtered_value2
                                  .replace(/\[w\]/gi, node.width + 30)
                                  .replace(/\[h\]/gi, node.height + 30)
                                  .replace(/\[x\]/gi, node.x - 15)
                                  .replace(/\[y\]/gi, node.y - 15)
                                  // Math calculation
                                  .replace(/{(.*?)}/gi, function (r) {
                                    let res_string = r.replace(
                                      /{(.*?)}/gi,
                                      "$1"
                                    );
                                    return eval(res_string);
                                  });

                                s_attr2[index] = filtered_value2;
                              }

                              return (
                                <React.Fragment key={s_index}>
                                  {/* {
                                                                        node.x == 0 || node.y == 0
                                                                    } */}
                                  <ShapeTag
                                    className="body start"
                                    x={node.x - 15}
                                    y={node.y - 15}
                                    width={node.width + 30}
                                    height={node.height + 30}
                                    stroke={node.stroke}
                                    fill={node.fill}
                                    strokeWidth={
                                      node.type !== "text"
                                        ? node.strokeWidth
                                        : 0
                                    }
                                    strokeDasharray={node.dasharray}
                                    {...s_attr2}
                                    style={{ opacity: 0 }}
                                  />
                                  <ShapeTag
                                    className="body start"
                                    x={node.x}
                                    y={node.y}
                                    width={node.width}
                                    height={node.height}
                                    stroke={node.stroke}
                                    fill={node.fill}
                                    fillOpacity={
                                      s && s.chart_type === "Flowchart" ? 1 : 0
                                    }
                                    strokeWidth={
                                      node.type !== "text"
                                        ? node.strokeWidth
                                        : 0
                                    }
                                    strokeDasharray={node.dasharray}
                                    {...s_attr}
                                  />
                                </React.Fragment>
                              );
                            } else {
                              return <></>;
                            }
                          })}
                        {s &&
                        (s.chart_type === "Flowchart" ||
                          node.type === "text") ? (
                          <>
                            <text
                              x={node.x + node.width / 2}
                              y={node.y + node.height / 2}
                              className="unselectable"
                              textAnchor="middle"
                              alignmentBaseline="middle"
                            >
                              {node &&
                                node.name &&
                                node.name
                                  .toLowerCase()
                                  .replace(/\b[a-z]/g, function (letter) {
                                    return letter.toUpperCase();
                                  })}
                            </text>
                          </>
                        ) : (
                          <></>
                        )}
                        {s && s.chart_type && s.chart_type === "Flowchart" ? (
                          <FlowchartConnector
                            params={{
                              node,
                              display: state.activeNode === i,
                              workflowsStart: state.workflowsStart,
                              index: i,
                            }}
                            state={state}
                            selectConnector={(dir) =>
                              self.selectConnector(dir, i)
                            }
                            doneConnection={(dir) =>
                              self.doneConnection(dir, i)
                            }
                          />
                        ) : (
                          <></>
                        )}
                        {state.focused && state.focused.index === i ? (
                          <FlowchartResizeNode
                            params={{ node }}
                            selectResize={(dir) => self.selectResize(dir)}
                          />
                        ) : (
                          <></>
                        )}
                      </g>
                    ) : (
                      <>
                        {node?.type == "text" ? (
                          <g
                            onMouseDown={(e) => self.selectObject(e, i)}
                            onClick={() => self.focusObject(i)}
                            onDoubleClick={() => self.openTextEditorPop(i)}
                            onMouseOver={() => {
                              self.props.setStateValue({ activeNode: i });
                            }}
                            onMouseLeave={() => {
                              self.props.setStateValue({ activeNode: null });
                            }}
                            id={`svg_obj_${i}`}
                            key={`shape_${i}`}
                            className={className}
                          >
                            {s &&
                              s.shape &&
                              s.shape.length &&
                              s.shape.map((shapeJSON, s_index) => {
                                // let shapeJSON = s.shape;
                                let ShapeTag = shapeJSON.tag;

                                let shape_attr = shapeJSON.attributes,
                                  filtered_value,
                                  filtered_value2,
                                  s_attr = {},
                                  s_attr2 = {};

                                if (s.shape_key === node.type) {
                                  for (let index in shape_attr) {
                                    filtered_value =
                                      shape_attr[index].toString();

                                    filtered_value = filtered_value
                                      .replace(/\[w\]/gi, node.width)
                                      .replace(/\[h\]/gi, node.height)
                                      .replace(/\[x\]/gi, node.x)
                                      .replace(/\[y\]/gi, node.y)
                                      // Math calculation
                                      .replace(/{(.*?)}/gi, function (r) {
                                        let res_string = r.replace(
                                          /{(.*?)}/gi,
                                          "$1"
                                        );
                                        return eval(res_string);
                                      });

                                    s_attr[index] = filtered_value;

                                    filtered_value2 =
                                      shape_attr[index].toString();

                                    filtered_value2 = filtered_value2
                                      .replace(/\[w\]/gi, node.width + 30)
                                      .replace(/\[h\]/gi, node.height + 30)
                                      .replace(/\[x\]/gi, node.x - 15)
                                      .replace(/\[y\]/gi, node.y - 15)
                                      // Math calculation
                                      .replace(/{(.*?)}/gi, function (r) {
                                        let res_string = r.replace(
                                          /{(.*?)}/gi,
                                          "$1"
                                        );
                                        return eval(res_string);
                                      });

                                    s_attr2[index] = filtered_value2;
                                  }

                                  return (
                                    <React.Fragment key={s_index}>
                                      <ShapeTag
                                        className="body start"
                                        x={node.x - 15}
                                        y={node.y - 15}
                                        width={node.width + 30}
                                        height={node.height + 30}
                                        stroke={node.stroke}
                                        fill={node.fill}
                                        strokeWidth={
                                          node.type !== "text"
                                            ? node.strokeWidth
                                            : 0
                                        }
                                        strokeDasharray={node.dasharray}
                                        {...s_attr2}
                                        style={{ opacity: 0 }}
                                      />
                                      <ShapeTag
                                        className="body start"
                                        x={node.x}
                                        y={node.y}
                                        width={node.width}
                                        height={node.height}
                                        stroke={node.stroke}
                                        fill={node.fill}
                                        fillOpacity={
                                          s && s.chart_type === "Flowchart"
                                            ? 1
                                            : 0
                                        }
                                        strokeWidth={
                                          node.type !== "text"
                                            ? node.strokeWidth
                                            : 0
                                        }
                                        strokeDasharray={node.dasharray}
                                        {...s_attr}
                                      />
                                    </React.Fragment>
                                  );
                                } else {
                                  return <></>;
                                }
                              })}
                            {s &&
                            (s.chart_type === "Flowchart" ||
                              node.type === "text") ? (
                              <>
                                <text
                                  x={node.x + node.width / 2}
                                  y={node.y + node.height / 2}
                                  className="unselectable"
                                  textAnchor="middle"
                                  alignmentBaseline="middle"
                                >
                                  {node &&
                                    node.name &&
                                    node.name
                                      .toLowerCase()
                                      .replace(/\b[a-z]/g, function (letter) {
                                        return letter.toUpperCase();
                                      })}
                                </text>
                              </>
                            ) : (
                              <></>
                            )}
                            {s &&
                            s.chart_type &&
                            s.chart_type === "Flowchart" ? (
                              <FlowchartConnector
                                params={{
                                  node,
                                  display: state.activeNode === i,
                                  workflowsStart: state.workflowsStart,
                                  index: i,
                                }}
                                state={state}
                                selectConnector={(dir) =>
                                  self.selectConnector(dir, i)
                                }
                                doneConnection={(dir) =>
                                  self.doneConnection(dir, i)
                                }
                              />
                            ) : (
                              <></>
                            )}
                            {state.focused && state.focused.index === i ? (
                              <FlowchartResizeNode
                                params={{ node }}
                                selectResize={(dir) => self.selectResize(dir)}
                              />
                            ) : (
                              <></>
                            )}
                          </g>
                        ) : (
                          <g
                            onMouseDown={(e) => self.selectObject(e, i)}
                            onClick={() => self.focusObject(i)}
                            onDoubleClick={() => self.openEditorPop(i)}
                            onMouseOver={() => {
                              self.props.setStateValue({ activeNode: i });
                            }}
                            onMouseLeave={() => {
                              self.props.setStateValue({ activeNode: null });
                            }}
                            id={`svg_obj_${i}`}
                            key={`shape_${i}`}
                            className={className}
                          >
                            {s &&
                              s.shape &&
                              s.shape.length &&
                              s.shape.map((shapeJSON, s_index) => {
                                // let shapeJSON = s.shape;
                                let ShapeTag = shapeJSON.tag;

                                let shape_attr = shapeJSON.attributes,
                                  filtered_value,
                                  filtered_value2,
                                  s_attr = {},
                                  s_attr2 = {};

                                if (s.shape_key === node.type) {
                                  for (let index in shape_attr) {
                                    filtered_value =
                                      shape_attr[index].toString();

                                    filtered_value = filtered_value
                                      .replace(/\[w\]/gi, node.width)
                                      .replace(/\[h\]/gi, node.height)
                                      .replace(/\[x\]/gi, node.x)
                                      .replace(/\[y\]/gi, node.y)
                                      // Math calculation
                                      .replace(/{(.*?)}/gi, function (r) {
                                        let res_string = r.replace(
                                          /{(.*?)}/gi,
                                          "$1"
                                        );
                                        return eval(res_string);
                                      });

                                    s_attr[index] = filtered_value;

                                    filtered_value2 =
                                      shape_attr[index].toString();

                                    filtered_value2 = filtered_value2
                                      .replace(/\[w\]/gi, node.width + 30)
                                      .replace(/\[h\]/gi, node.height + 30)
                                      .replace(/\[x\]/gi, node.x - 15)
                                      .replace(/\[y\]/gi, node.y - 15)
                                      // Math calculation
                                      .replace(/{(.*?)}/gi, function (r) {
                                        let res_string = r.replace(
                                          /{(.*?)}/gi,
                                          "$1"
                                        );
                                        return eval(res_string);
                                      });

                                    s_attr2[index] = filtered_value2;
                                  }

                                  return (
                                    <React.Fragment key={s_index}>
                                      <ShapeTag
                                        className="body start"
                                        x={node.x - 15}
                                        y={node.y - 15}
                                        width={node.width + 30}
                                        height={node.height + 30}
                                        stroke={node.stroke}
                                        fill={node.fill}
                                        strokeWidth={
                                          node.type !== "text"
                                            ? node.strokeWidth
                                            : 0
                                        }
                                        strokeDasharray={node.dasharray}
                                        {...s_attr2}
                                        style={{ opacity: 0 }}
                                      />
                                      <ShapeTag
                                        className="body start"
                                        x={node.x}
                                        y={node.y}
                                        width={node.width}
                                        height={node.height}
                                        stroke={node.stroke}
                                        fill={node.fill}
                                        fillOpacity={
                                          s && s.chart_type === "Flowchart"
                                            ? 1
                                            : 0
                                        }
                                        strokeWidth={
                                          node.type !== "text"
                                            ? node.strokeWidth
                                            : 0
                                        }
                                        strokeDasharray={node.dasharray}
                                        {...s_attr}
                                      />
                                    </React.Fragment>
                                  );
                                } else {
                                  return <></>;
                                }
                              })}
                            {s &&
                            (s.chart_type === "Flowchart" ||
                              node.type === "text") ? (
                              <>
                                <text
                                  x={node.x + node.width / 2}
                                  y={node.y + node.height / 2}
                                  className="unselectable"
                                  textAnchor="middle"
                                  alignmentBaseline="middle"
                                >
                                  {node &&
                                    node.name &&
                                    node.name
                                      .toLowerCase()
                                      .replace(/\b[a-z]/g, function (letter) {
                                        return letter.toUpperCase();
                                      })}
                                </text>
                              </>
                            ) : (
                              <></>
                            )}
                            {s &&
                            s.chart_type &&
                            s.chart_type === "Flowchart" ? (
                              <FlowchartConnector
                                params={{
                                  node,
                                  display: state.activeNode === i,
                                  workflowsStart: state.workflowsStart,
                                  index: i,
                                }}
                                state={state}
                                selectConnector={(dir) =>
                                  self.selectConnector(dir, i)
                                }
                                doneConnection={(dir) =>
                                  self.doneConnection(dir, i)
                                }
                              />
                            ) : (
                              <></>
                            )}
                            {state.focused && state.focused.index === i ? (
                              <FlowchartResizeNode
                                params={{ node }}
                                selectResize={(dir) => self.selectResize(dir)}
                              />
                            ) : (
                              <></>
                            )}
                          </g>
                        )}
                      </>
                    )}
                  </>
                );
              })}
            <rect
              x={
                state.multiSelectionStatus
                  ? state.multiSelectionStatus.startX
                  : 1
              }
              y={
                state.multiSelectionStatus
                  ? state.multiSelectionStatus.startY
                  : 1
              }
              width={
                state.multiSelectionStatus
                  ? state.multiSelectionStatus.width
                  : 10
              }
              height={
                state.multiSelectionStatus
                  ? state.multiSelectionStatus.height
                  : 10
              }
              fill="#0000ff88"
              stroke="#12640a"
              fillOpacity={0.1}
              id="selectionRect"
              style={{
                visibility: state.multiSelectionStatus ? "visible" : "hidden",
              }}
              onMouseDown={(e) => self.multiselectObject(e)}
            />
          </svg>
          {/* <SelectionMenu showSelectionMenu={state.showSelectionMenu} onGoTo={(side, index) => self.handleGoTo(side, index)} /> */}
          <ContextMenu
            showContextMenu={state.showContextMenu}
            onGoTo={(side, index) => self.handleGoTo(side, index)}
            undo_process={state?.undo_process}
            redo_process={state?.redo_process}
            setStateValue={(params) => this.props.setStateValue(params)}
          />
          <ContextMultiSelectMenu
            showContextMultiSelectMenu={state.showContextMultiSelectMenu}
            onGoTo={(side) => self.multiselecthandleGoTo(side)}
          />
          <ConnectorContextMenu
            showContextMenu={state.openConnectorContextMenu}
            onGoTo={(side, index) => self.handleConnectionContext(side, index)}
          />

          <ShapePopup
            shapes={state.shapes}
            showShapePopup={this.state.showShapePopup}
            selectShape={async (key) => {
              // console.log('clicked key: ', key);
              if (this.state.showShapePopup) {
                let { x, y } = this.state.showShapePopup;
                let last =
                  state.nodes.connector[state.nodes.connector.length - 1];
                this.props.setStateValue({ drag_type: key });

                if (
                  last.start_direction === "left" ||
                  last.start_direction === "right"
                ) {
                  if (last.positions[0][1] !== last.positions[2][3]) {
                    x -= 40;
                  }
                  if (last.positions[0][1] > last.positions[2][3]) {
                    y -= 40;
                  }
                }

                if (
                  last.start_direction === "bottom" ||
                  last.start_direction === "top"
                ) {
                  if (last.positions[0][0] === last.positions[2][2]) {
                    x -= 40;
                  } else {
                    y -= 20;
                  }

                  if (last.positions[0][0] > last.positions[2][2]) {
                    x -= 80;
                  }
                }
                this.nodes_changed(state.nodes);

                setTimeout(() => {
                  this.dragging(x, y);
                }, 10);

                setTimeout(async () => {
                  this.setState({ endConnector: false });
                  let endDir = await self.findDirection(
                    last.start_dir,
                    last.positions
                  );

                  // nodes.connector
                  last.shape2_index = state.nodes.shapes.length - 1;
                  last.end_direction = endDir;

                  this.nodes_changed(state.nodes);

                  this.setState({ showShapePopup: null });
                }, 100);
              }
            }}
          />
        </div>
        {state.showEditorPopup ? (
          <EditorPopup
            setStateValue={(params) => this.props.setStateValue(params)}
            showEditorPopup={state.showEditorPopup}
            shapesList={state.shapes}
            onSave={(node, index) => self.saveCanvas(node, index)}
            closeEditorPopup={() => self.closeEditorPopup()}
          ></EditorPopup>
        ) : (
          ""
        )}
        {state.showTextEditorPopup ? (
          <TextEditorPopup
            setStateValue={(params) => this.props.setStateValue(params)}
            showTextEditorPopup={state.showTextEditorPopup}
            shapesList={state.shapes}
            onSave={(node, index) => self.saveCanvas(node, index)}
            closeTextEditorPopup={() => self.closeTextEditorPopup()}
          ></TextEditorPopup>
        ) : (
          ""
        )}
      </div>
    );
  }
}
