import React, { Component } from "react";

export default class Loading extends Component {
    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <span class="spinner-border" role="status"> </span>
            </div>
        );
    }
}
