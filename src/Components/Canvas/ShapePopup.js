import React, { Component } from "react";

export default class ShapePopup extends Component {
    render() {
        let { shapes, showShapePopup } = this.props;
        if (showShapePopup) {
            let { x, y } = showShapePopup;
            return (
                <div className="shape-dropdown" style={{ top: y, left: x }}>
                    {
                        shapes.map((s, s_i) => {
                            let w = 40,
                                h = 25;

                            return (
                                <div className="shape-list" key={s_i}>
                                    <div onClick={() => this.props.selectShape(s.shape_key)}>
                                        <svg width={w} height={h} viewBox="0 0 40 25">
                                            {
                                                s.shape.map(function (shapeJSON, s_index) {
                                                    let ShapeTag = shapeJSON.tag;

                                                    let shape_attr = shapeJSON.attributes, filtered_value = "", s_attr = {};

                                                    for (let index in shape_attr) {
                                                        filtered_value = shape_attr[index].toString();
                                                        filtered_value = filtered_value
                                                            .replace(/\[w\]/gi, w - 4)
                                                            .replace(/\[h\]/gi, h - 4)
                                                            .replace(/\[x\]/gi, 1)
                                                            .replace(/\[y\]/gi, 1)
                                                            // Math calculation
                                                            .replace(/{(.*?)}/gi, function (r) {
                                                                let res_string = r.replace(/{(.*?)}/gi, "\$1");
                                                                return eval(res_string)
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
                                                                strokeDasharray={s.shape_key === 'text' ? '5 5' : '0 0'}
                                                            ></ShapeTag>
                                                            <text
                                                                x={w / 2}
                                                                y={h / 2}
                                                                textAnchor="middle"
                                                                alignmentBaseline="middle"
                                                            >{s.shape_key === 'text' ? 'Text' : null}</text>
                                                        </g>
                                                    );
                                                })
                                            }
                                        </svg>
                                        {s.shape_key}
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            );
        } else {
            return (<></>);
        }
    }
}
