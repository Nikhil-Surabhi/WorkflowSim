import React, { Component } from "react";
import { ViewShapeApi } from "../Api/shape.api";

export class SvgImage extends Component {
    state = {
        shapes: []
    }

    getAllShapes = async () => {
        let shapes = await ViewShapeApi();
        this.setState({ shapes: shapes.data.allShapes });
    }

    componentDidMount() {
        this.getAllShapes();
        // this.getTemplateList();
    }

    render() {
        let self = this;
        let state = self.state;
        // console.log('props: ', self.props);
        let template = self.props.template;
        if (template && template.chart && self.state.shapes && self.state.shapes.length) {
            let width = template.chart.width ?? 842;
            let height = template.chart.height ?? 595;
            return (
                <svg viewBox={`0 0 ${width} ${height}`} style={{ height: self.props.height ?? 150, width: '100%', objectFit: 'contain' }}>
                    <marker id="arrow" markerUnits="strokeWidth" viewBox="0 0 12 12" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#000"></path>
                    </marker>
                    <marker id="squareArrow" markerUnits="strokeWidth" viewBox="0 0 12 12" refX="5" refY="6" markerWidth="8" markerHeight="8" orient="auto">
                        <rect x="1" y="1" width="10" height="10" fill="white" stroke="#000" strokeWidth="1" />
                    </marker>
                    <marker id="squareFillArrow" markerUnits="strokeWidth" viewBox="0 0 12 12" refX="5" refY="6" markerWidth="8" markerHeight="8" orient="auto">
                        <rect x="1" y="1" width="10" height="10" fill="#000" stroke="#000" strokeWidth="1" />
                    </marker>
                    <marker id="circleArrow" markerUnits="strokeWidth" viewBox="0 0 12 12" refX="5" refY="6" markerWidth="8" markerHeight="8" orient="auto">
                        <circle cx="6" cy="6" r="5" width="10" height="10" fill="white" stroke="#000" strokeWidth="1" />
                    </marker>
                    <marker id="circleFillArrow" markerUnits="strokeWidth" viewBox="0 0 12 12" refX="5" refY="6" markerWidth="8" markerHeight="8" orient="auto">
                        <circle cx="6" cy="6" r="5" width="10" height="10" fill="#000" stroke="#000" strokeWidth="1" />
                    </marker>
                    { // Connectors
                        template.chart && template.chart.connector && template.chart.connector.map(function (node, i) {
                            let path = '';
                            let connClass = "connection";

                            node.positions.forEach(function (row, j) {
                                path += j === 0 ? 'M' : 'L';
                                path += `${row[0]},${row[1]}L${row[2]},${row[3]}`;
                            });
                            return <g className={connClass} key={i}>
                                <path stroke="#000" strokeWidth="15" fill="none" strokeDasharray={node.dasharray} d={path} markerEnd={`url(#${node.arrow})`} style={{ opacity: 0 }}></path>
                                <path stroke="#000" strokeWidth="2" fill="none" strokeDasharray={node.dasharray} d={path} markerEnd={`url(#${node.arrow})`}></path>
                            </g>
                        })
                    }
                    {
                        template.chart && template.chart.shapes && template.chart.shapes.map((node, index) => {
                            let filtered_shapes = state.shapes.filter(s => s.shape_key === node.type);
                            let s = filtered_shapes[0];

                            return (<g key={index}>
                                { // Shapes
                                    s && s.shape && s.shape.length && s.shape.map((shapeJSON, s_index) => {
                                        // let shapeJSON = s.shape;
                                        let ShapeTag = shapeJSON.tag;

                                        let shape_attr = shapeJSON.attributes, filtered_value, s_attr = {};


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
                                                        let res_string = r.replace(/{(.*?)}/gi, "\$1");
                                                        return eval(res_string)
                                                    });

                                                s_attr[index] = filtered_value;
                                            }

                                            return (
                                                <React.Fragment key={s_index}>
                                                    <ShapeTag
                                                        className="body start"
                                                        x={node.x}
                                                        y={node.y}
                                                        width={node.width}
                                                        height={node.height}
                                                        stroke={node.stroke}
                                                        fill={node.fill}
                                                        fillOpacity={s && s.chart_type === "Flowchart" ? 1 : 0}
                                                        strokeWidth={node.type !== 'text' ? node.strokeWidth : 0}
                                                        strokeDasharray={node.dasharray}
                                                        {...s_attr}
                                                    />
                                                </React.Fragment>
                                            )
                                        } else {
                                            return <></>
                                        }
                                    })
                                }

                                { // Text
                                    s && (s.chart_type === 'Flowchart' || node.type === 'text') ?
                                        <>
                                            <text
                                                x={node.x + node.width / 2}
                                                y={node.y + node.height / 2}
                                                style={{ fontSize: 8 }}
                                                textAnchor="middle"
                                                alignmentBaseline="middle"
                                            >
                                                {
                                                    node && node.name && node.name.toLowerCase().replace(/\b[a-z]/g, function (letter) {
                                                        return letter.toUpperCase();
                                                    })
                                                }
                                            </text>
                                        </>
                                        : <></>
                                }
                            </g>);
                        })
                    }
                </svg>
            );
        } else {
            return <div>Loading</div>
        }
    }
}