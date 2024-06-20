import { Component } from "react";

class ContextMultiSelectMenu extends Component {
    handleGoTo(e, side) {
        if (e.button === 0) {
            this.props.onGoTo(side);
        }
    }
    render() {
        if (this.props.showContextMultiSelectMenu.x && this.props.showContextMultiSelectMenu.y) {
            return (
                <ul className="context-menu" style={{ left: this.props.showContextMultiSelectMenu.x + 'px', top: this.props.showContextMultiSelectMenu.y + 'px', }}>
                    <li onMouseDown={(e) => this.handleGoTo(e, 'front')}>Go to Front</li>
                    <li onMouseDown={(e) => this.handleGoTo(e, 'back')}>Go to Back</li>
                    <li onMouseDown={(e) => this.handleGoTo(e, 'delete')}>Delete</li>
                    <li onMouseDown={(e) => this.handleGoTo(e, 'copy')}>Copy</li>
                </ul>
            );
        } else {
            return null
        }
    }
}

export default ContextMultiSelectMenu;
