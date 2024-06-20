import { Component } from "react";

class ConnectorContextMenu extends Component {
    handleGoTo(e, side, index) {
        if (e.button === 0) {
            this.props.onGoTo(side, index);
        }
    }
    render() {
        if (this.props.showContextMenu) {
            let { x, y, index } = this.props.showContextMenu;
            if (x && y) {
                return (
                    <ul className="context-menu" style={{ left: x + 'px', top: y + 'px', }}>
                        <li onMouseDown={(e) => this.handleGoTo(e, 'delete', index)}>Delete</li>
                    </ul>
                );
            } else {
                return null
            }
        } else {
            return null
        }
    }
}

export default ConnectorContextMenu;
