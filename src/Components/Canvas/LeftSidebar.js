import React, { Component } from "react";
import { getShapeGroups } from "../../Api/chart.api";
import { ChartSvgImage } from "../../Views/ChartSvgImage";
// import { getCharts } from "../../Api/chart.api"

export default class CanvasLeftSidebar extends Component {
  state = {
    modalIsOpen: false,
    shapeDetail: null,
    shapeGroups: [],
  };
  dragStart = (shape, chart = null) => {
    this.props.setStateValue({ drag_type: shape, templateChart: chart });
  };
  openModal(status, s) {
    // console.log('open model', status);
    // console.log('open model', this.state.modalIsOpen);
    this.setState({ shapeDetail: s });
    // setTimeout(() => {
    this.setState({ modalIsOpen: status });
    // }, 500);
  }
  closeModal(status) {
    this.setState({ modalIsOpen: status });
    // this.setState({ shapeDetail: null });
  }
  fetchShapeGroups = async () => {
    let response = await getShapeGroups();

    this.setState({ shapeGroups: response.data });
    // console.log("shape groups: ", response);
  };
  componentDidMount() {
    this.fetchShapeGroups();
  }
  render() {
    let state = this.props.state;
    let self = this;
    let w = 40,
      h = 25;

    let templates = [];

    if (state.charts && state.charts.length) {
      templates = state.charts[0].data.filter(function (ch) {
        return ch.is_template == true;
      });
      console.log("template: ", templates, state.charts[0].data);
    }

    return (
      <div className="flowchart-icons">
        {self.state.shapeDetail ? (
          <>
            <div
              // onAfterOpen={afterOpenModal}
              // style={style.customStyles}
              style={{
                display: self.state.modalIsOpen ? "block" : "none",
                position: "absolute",
                top: "15%",
                left: "calc(100% + 10px)",
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "red",
                borderRadius: 4,
                padding: 10,
                zIndex: 999,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: self.state.modalIsOpen ? "block" : "none",
                  position: "absolute",
                  top: "50%",
                  left: "-20px",
                  // marginRight: '-50%',
                  transform: "translateY(-50%)",
                  borderWidth: 10,
                  borderStyle: "solid",
                  borderTopColor: "transparent",
                  borderBottomColor: "transparent",
                  borderLeftColor: "transparent",
                  borderRightColor: "#fff",
                  zIndex: 999,
                }}
              ></div>
              <svg
                width={w}
                height={h}
                viewBox="0 0 40 25"
                style={{
                  transform: "scale(3)",
                  marginLeft: 60,
                  marginRight: 60,
                  marginTop: 60,
                  marginBottom: 20,
                }}
              >
                {self.state.shapeDetail &&
                  self.state.shapeDetail.shape.map(function (
                    shapeJSON,
                    s_index
                  ) {
                    let ShapeTag = shapeJSON.tag;

                    let shape_attr = shapeJSON.attributes,
                      filtered_value = "",
                      s_attr = {};

                    for (let index in shape_attr) {
                      filtered_value = shape_attr[index].toString();
                      filtered_value = filtered_value
                        .replace(/\[w\]/gi, w - 4)
                        .replace(/\[h\]/gi, h - 4)
                        .replace(/\[x\]/gi, 1)
                        .replace(/\[y\]/gi, 1)
                        // Math calculation
                        .replace(/{(.*?)}/gi, function (r) {
                          let res_string = r.replace(/{(.*?)}/gi, "$1");
                          return eval(res_string);
                        });

                      s_attr[index] = filtered_value;
                    }
                    return (
                      <g key={s_index}>
                        <ShapeTag
                          width={w - 4}
                          height={h - 4}
                          {...s_attr}
                          x="1"
                          y="1"
                          stroke="#000"
                          strokeWidth={2}
                          fill="#ffffff"
                          key={s_index}
                          strokeDasharray={
                            self.state.shapeDetail &&
                            self.state.shapeDetail.shape_key === "text"
                              ? "5 5"
                              : "0 0"
                          }
                        ></ShapeTag>
                        <text
                          x={w / 2}
                          y={h / 2}
                          textAnchor="middle"
                          alignmentBaseline="middle"
                        >
                          {self.state.shapeDetail &&
                          self.state.shapeDetail.shape_key === "text"
                            ? "Text"
                            : null}
                        </text>
                      </g>
                    );
                  })}
              </svg>
              <p style={{ padding: 0, margin: 0, marginTop: 20 }}>
                {self.state.shapeDetail.shape_key}
              </p>
            </div>
          </>
        ) : (
          ""
        )}
        {state.sidebarShapes &&
          Object.keys(state.sidebarShapes).map((type) => {
            return (
              <div className="container-fluid">
                <h4>{type} Shapes</h4>
                <div className="side-shape-container">
                  {state.sidebarShapes[type].map((s, s_i) => {
                    let w = 40,
                      h = 25;

                    return (
                      <div className="side-shape" key={s_i}>
                        <div
                          onDragStart={() => self.dragStart(s.shape_key)}
                          draggable
                        >
                          <svg
                            width={w}
                            height={h}
                            viewBox="0 0 40 25"
                            onMouseEnter={() => self.openModal(true, s)}
                            onMouseLeave={() => self.closeModal(false)}
                          >
                            {s.shape.map(function (shapeJSON, s_index) {
                              let ShapeTag = shapeJSON.tag;

                              let shape_attr = shapeJSON.attributes,
                                filtered_value = "",
                                s_attr = {};

                              for (let index in shape_attr) {
                                filtered_value = shape_attr[index].toString();
                                filtered_value = filtered_value
                                  .replace(/\[w\]/gi, w - 4)
                                  .replace(/\[h\]/gi, h - 4)
                                  .replace(/\[x\]/gi, 1)
                                  .replace(/\[y\]/gi, 1)
                                  // Math calculation
                                  .replace(/{(.*?)}/gi, function (r) {
                                    let res_string = r.replace(
                                      /{(.*?)}/gi,
                                      "$1"
                                    );
                                    return eval(res_string);
                                  });

                                s_attr[index] = filtered_value;
                              }
                              return (
                                <g key={s_index}>
                                  <ShapeTag
                                    width={w - 4}
                                    height={h - 4}
                                    {...s_attr}
                                    x="1"
                                    y="1"
                                    stroke="#000"
                                    strokeWidth={2}
                                    fill="#ffffff"
                                    key={s_index}
                                    strokeDasharray={
                                      s.shape_key === "text" ? "5 5" : "0 0"
                                    }
                                  ></ShapeTag>
                                  <text
                                    x={w / 2}
                                    y={h / 2}
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                  >
                                    {s.shape_key === "text" ? "Text" : null}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

        {this?.state?.shapeGroups?.length ? (
          <div className="container-fluid">
            <h4>Shape Groups</h4>
            <div className="side-template-container">
              {this?.state?.shapeGroups?.map(function (ch, j) {
                return (
                  <div className="side-template" key={j}>
                    <div
                      className="side-template-box"
                      onDragStart={() => self.dragStart("fc", ch)}
                      draggable
                    >
                      <ChartSvgImage
                        id={ch.chart_id}
                        height={100}
                        template={ch}
                      />
                    </div>
                    <h6>
                      {ch.chart_name && ch.chart_name.trim() !== ""
                        ? ch.chart_name
                        : "Blank diagram"}
                    </h6>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}
