import { Component } from "react";

export default class CustomSelect extends Component {
    dropdownSelected = (val) => {
        this.props.chageValue(val);
    }
    render() {
        return (
            <div class="dropdown">
                <div class="form-control dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.props.value ?? 'Select Shape'}
                </div>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ height: 300, overflowY: 'scroll' }}>
                    {/* <select name="type" className="form-control" value={type} onChange={e => this.handleChange(e, 'type')}> */}
                    {
                        this.props.items.map(s => {
                            console.log('shape', s);
                            let w = 30,
                                h = 18;
                            return (
                                <div class="dropdown-item" onClick={() => this.dropdownSelected(s.shape_key)}>
                                    <span>
                                        <svg width={w} height={h} viewBox="0 0 30 18">
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
                                    </span>
                                    &nbsp; {s.shape_key}
                                </div>
                            )
                        })
                    }
                </div>
            </div >
        );
    }
}