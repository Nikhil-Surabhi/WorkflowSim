import { Component } from "react";

class SelectionMenu extends Component {
    handleGoTo(e, side, index) {
        if (e.button === 0) {
            this.props.onGoTo(side, index);
        }
    }
    render() {
        if (this.props.showContextMenu.x && this.props.showContextMenu.y) {
            return (
                <ul className="context-menu" style={{ left: this.props.showContextMenu.x + 'px', top: this.props.showContextMenu.y + 'px', }}>
                    <li onMouseDown={(e) => this.handleGoTo(e, 'front', this.props.showContextMenu.index)}>Go to Front</li>
                    <li onMouseDown={(e) => this.handleGoTo(e, 'back', this.props.showContextMenu.index)}>Go to Back</li>
                    <li onMouseDown={(e) => this.handleGoTo(e, 'delete', this.props.showContextMenu.index)}>Delete</li>
                    <li onMouseDown={(e) => this.handleGoTo(e, 'copy', this.props.showContextMenu.index)}>Copy</li>
                </ul>
            );
        } else {
            return null
        }
    }
}

export default SelectionMenu;
