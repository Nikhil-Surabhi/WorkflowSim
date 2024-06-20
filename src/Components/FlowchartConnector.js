import React, { Component } from "react";

export default class FlowchartConnector extends Component {

    render() {
        let { node, display, workflowsStart, index } = this.props.params;
        let { focused } = this.props.state;

        // console.log('connector node: ', focused);

        let styles = {};
        if (!display || workflowsStart) {
            styles.opacity = 0;
        }

        return (
            <>
                <circle
                    cx={node.x - 20}
                    cy={node.y + node.height / 2}
                    r={6}
                    className="connector"
                    onMouseDown={() => this.props.selectConnector('left')}
                    onMouseOver={() => { this.props.doneConnection('left') }}
                    style={styles}
                />
                <circle
                    cx={(node.x + node.width) + 20}
                    cy={node.y + node.height / 2}
                    r={6}
                    className="connector"
                    onMouseDown={() => this.props.selectConnector('right')}
                    onMouseOver={() => { this.props.doneConnection('right') }}
                    style={styles}
                />
                <circle
                    cx={node.x + node.width / 2}
                    cy={node.y - 20}
                    r={6}
                    className="connector"
                    onMouseDown={() => this.props.selectConnector('top')}
                    onMouseOver={() => { this.props.doneConnection('top') }}
                    style={styles}
                />
                <circle
                    cx={node.x + node.width / 2}
                    cy={(node.y + node.height) + 20}
                    r={6}
                    className="connector"
                    onMouseDown={() => this.props.selectConnector('bottom')}
                    onMouseOver={() => { this.props.doneConnection('bottom') }}
                    style={styles}
                />
            </>
        );
    }
}
