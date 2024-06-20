import React, { Component } from "react";

export default class FlowchartResizeNode extends Component {
    render() {
        let { node } = this.props.params;
        return (
            <g>
                <rect
                    className="resize-square-border"
                    x={node.x - 5}
                    y={node.y - 5}
                    width={node.width + 10}
                    height={node.height + 10}
                    stroke="blue"
                    strokeWidth="2"
                    strokeDasharray="15,15"
                    fill="none"
                ></rect>
                <rect
                    className="resize-square"
                    style={{ cursor: 'se-resize' }}
                    x={node.x - 10}
                    y={node.y - 10}
                    rx="0"
                    onMouseDown={() => this.props.selectResize('left-top')}
                ></rect>
                <rect
                    className="resize-square"
                    style={{ cursor: 'sw-resize' }}
                    x={node.x + node.width}
                    y={node.y - 10}
                    rx="0"
                    onMouseDown={() => this.props.selectResize('right-top')}
                ></rect>
                <rect
                    className="resize-square"
                    style={{ cursor: 'sw-resize' }}
                    x={node.x - 10}
                    y={node.y + node.height}
                    rx="0"
                    onMouseDown={() => this.props.selectResize('left-bottom')}
                ></rect>
                <rect
                    className="resize-square"
                    style={{ cursor: 'se-resize' }}
                    x={node.x + node.width}
                    y={node.y + node.height}
                    rx="0"
                    onMouseDown={() => this.props.selectResize('right-bottom')}
                ></rect>
                <rect
                    className="resize-square resize-x"
                    style={{ cursor: 'e-resize' }}
                    x={node.x - 10}
                    y={node.y + node.height / 2 - 5}
                    rx="0"
                    onMouseDown={() => this.props.selectResize('left')}
                ></rect>
                <rect
                    className="resize-square resize-x"
                    style={{ cursor: 'e-resize' }}
                    x={node.x + node.width}
                    y={node.y + node.height / 2 - 5}
                    rx="0"
                    onMouseDown={() => this.props.selectResize('right')}
                ></rect>
                <rect
                    className="resize-square resize-y"
                    style={{ cursor: 's-resize' }}
                    x={node.x + node.width / 2 - 5}
                    y={node.y - 10}
                    rx="0"
                    onMouseDown={() => this.props.selectResize('top')}
                ></rect>
                <rect
                    className="resize-square resize-y"
                    style={{ cursor: 's-resize' }}
                    x={node.x + node.width / 2 - 5}
                    y={node.y + node.height}
                    rx="0"
                    onMouseDown={() => this.props.selectResize('bottom')}
                ></rect>
            </g>
        );
    }
}
