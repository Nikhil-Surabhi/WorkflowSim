import { Component } from "react";

class ContextMenu extends Component {
    handleGoTo(e, side, index) {
        if (e.button === 0) {
            this.props.onGoTo(side, index);
        }
    }

    saveUndoProcess = (params, delete_redo = true) => {
        let state = this.props.state;
        let undo_process = state.undo_process ?? [];
        undo_process.push(params);

        this.props.setStateValue({ undo_process });

        if (delete_redo) {
            this.props.setStateValue({ redo_process: [] });
        }
    }
    saveRedoProcess = params => {
        let state = this.props.state;
        let redo_process = state.redo_process;
        redo_process.push(params);

        this.props.setStateValue({ redo_process });
    }

    doUndo = () => {
        let state = this.props.state;
        let undo_process = state?.undo_process;
        let nodes = state?.nodes;

        if (undo_process && undo_process.length) {
            this.saveRedoProcess(nodes);
            let last = undo_process[undo_process.length - 1];

            switch (last.action) {
                case 'add-shape':
                    this.saveRedoProcess({
                        action: 'remove-shape',
                        index: nodes.shapes.length,
                        data: last.data,
                        connectors: last.connectors
                    });
                    nodes.shapes.push(last.data);
                    nodes.connector = last.connectors;
                    break;

                case 'remove-shape':
                    this.saveRedoProcess({
                        action: 'add-shape',
                        index: last.index,
                        data: last.data
                    });

                    nodes.shapes.splice(last.index, 1);

                    break;

                case 'add-connector':
                    this.saveRedoProcess({
                        action: 'remove-connector',
                        index: last.index,
                        connector: [...nodes.connector]
                    }, false);

                    nodes.connector = last.connector;
                    break;

                case 'remove-connector':
                    this.saveRedoProcess({
                        action: 'add-connector',
                        index: last.index,
                        connector: [...nodes.connector]
                    }, false);

                    nodes.connector.splice(last.index, 1);
                    break;

                case 'resize-shape':
                    this.saveRedoProcess({
                        action: 'resize-shape',
                        index: last.index,
                        data: { ...nodes.shapes[last.index] },
                        connectors: last.connectors
                    });

                    nodes.shapes[last.index] = last.data;
                    break;

                case 'move-shape':
                    this.saveRedoProcess({
                        action: 'move-shape',
                        index: last.index,
                        data: { ...nodes.shapes[last.index] },
                        connector: [...nodes.connector],
                    });

                    nodes.shapes[last.index] = last.data;
                    nodes.connector = last.connector;
                    break;

                case 'move-connector':
                    console.log('Undo move-connector');
                    console.log('Undo move-connector', last.index);
                    console.log('Undo move-connector', [...nodes.connector]);
                    this.saveRedoProcess({
                        action: 'move-connector',
                        index: last.index,
                        connector: [...nodes.connector],
                    });

                    nodes.connector = last.connector;
                    break;


                default:
                    break;
            }

            undo_process.splice(undo_process.length - 1, 1)
        }

        console.log('undo process: ', undo_process);

        this?.props?.setStateValue({ undo_process, nodes });
    }

    doRedo = () => {
        let state = this.props.state;
        let redo_process = state?.redo_process;
        let nodes = state?.nodes;

        if (redo_process && redo_process.length) {
            let last = redo_process[redo_process.length - 1];

            this.saveUndoProcess(nodes, false);

            this.props.setStateValue({ nodes: last });

            switch (last.action) {
                case 'add-shape':
                    nodes.shapes.push(last.data);
                    this.saveUndoProcess({
                        action: 'remove-shape',
                        index: last.index,
                        data: last.data
                    }, false);
                    break;

                case 'remove-shape':
                    this.saveUndoProcess({
                        action: 'add-shape',
                        index: last.index,
                        data: last.data
                    });

                    nodes.shapes.splice(last.index, 1);

                    break;

                case 'add-connector':
                    this.saveUndoProcess({
                        action: 'remove-connector',
                        index: last.index,
                        connector: [...nodes.connector]
                    }, false);

                    nodes.connector = last.connector;
                    break;

                case 'remove-connector':
                    this.saveUndoProcess({
                        action: 'add-connector',
                        index: last.index,
                        connector: [...nodes.connector]
                    }, false);

                    nodes.connector.splice(last.index, 1);
                    break;

                case 'resize-shape':
                    this.saveUndoProcess({
                        action: 'resize-shape',
                        index: last.index,
                        data: { ...nodes.shapes[last.index] }
                    });
                    console.log('last.data', last.data);

                    nodes.shapes[last.index] = last.data;
                    break;

                case 'move-shape':
                    this.saveUndoProcess({
                        action: 'move-shape',
                        index: last.index,
                        data: { ...nodes.shapes[last.index] },
                        connector: [...nodes.connector],
                    });

                    nodes.shapes[last.index] = last.data;
                    nodes.connector = last.connector;
                    // nodes.connector.push(last.connector);
                    break;

                case 'move-connector':
                    console.log('redo move-connector');
                    console.log('redo move-connector', last.index);
                    console.log('redo move-connector', [...nodes.connector]);
                    this.saveUndoProcess({
                        action: 'move-connector',
                        index: last.index,
                        connector: [...nodes.connector],
                    });

                    nodes.connector = last.connector;
                    break;

                default:
                    break;
            }

            redo_process.splice(-1, 1);
        }

        console.log('redo process: ', redo_process);

        this.props.setStateValue({ redo_process, nodes });
    }

    render() {
        console.log(this?.props?.state?.undo_process, this?.props?.state?.redo_process, 'sasasa')
        if (this.props.showContextMenu.x && this.props.showContextMenu.y) {
            return (
                <ul className="context-menu" style={{ left: this.props.showContextMenu.x + 'px', top: this.props.showContextMenu.y + 'px', }}>
                    {/* <li onMouseDown={(e) => this.handleGoTo(e, 'front', this.props.showContextMenu.index)}>Go to Front</li> */}
                    {/* <li onMouseDown={(e) => this.handleGoTo(e, 'back', this.props.showContextMenu.index)}>Go to Back</li> */}
                    <li onMouseDown={() => this.doUndo()}>Undo</li>
                    <li onMouseDown={() => this.doRedo()}>Redo</li>
                    <li onMouseDown={(e) => this.handleGoTo(e, 'copy', this.props.showContextMenu.index)}>Copy</li>
                    <li onMouseDown={(e) => this.handleGoTo(e, 'paste', this.props.showContextMenu.index)}>Paste</li>
                    <li onMouseDown={(e) => this.handleGoTo(e, 'delete', this.props.showContextMenu.index)}>Delete</li>
                    <li>Add To Shape Group</li>
                </ul >
            );
        } else {
            return null
        }
    }
}

export default ContextMenu;
