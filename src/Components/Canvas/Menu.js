import React, { Component } from "react";

export default class CanvasMenu extends Component {

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
        let undo_process = [...state.undo_process];
        let nodes = state.nodes;

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

        this.props.setStateValue({ undo_process, nodes });
    }
    doRedo = () => {
        let state = this.props.state;
        let redo_process = state.redo_process;
        let nodes = state.nodes;

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

    toggleDropdown = name => {
        let state = this.props.state
        if (state.dropdownOpen && state.dropdownOpen === name) {
            this.props.setStateValue({ dropdownOpen: null });
        } else {
            this.props.setStateValue({ dropdownOpen: name });
        }
    }

    selectArrow = (arrow) => {
        let state = this.props.state
        this.props.setStateValue({
            activeArrow: arrow,
            dropdownOpen: null
        });

        if (state.connectorFocused) {
            let nodes = state.nodes
            nodes.connector[state.connectorFocused.index].arrow = arrow;
            this.props.setStateValue({ nodes })
        }
    }

    changeShapeHandler = (e, key) => {
        let state = this.props.state;
        if (state.focused) {
            let nodes = state.nodes;
            nodes.shapes[state.focused.index][key] = e.target.value;
            this.props.setStateValue({ nodes: nodes })
        }
    }

    selectBorderType = (dasharray) => {
        let state = this.props.state
        this.props.setStateValue({
            activeDashArray: dasharray,
            dropdownOpen: null
        });
        let nodes = state.nodes
        if (state.connectorFocused) {
            nodes.connector[state.connectorFocused.index].dasharray = dasharray;
            this.setState({ nodes })
        }
        if (state.focused) {
            nodes.shapes[state.focused.index].dasharray = dasharray;
            this.setState({ nodes })
        }
    }
    render() {
        let state = this.props.state
        return (
            <div className="canvas-menu">
                <div className="menu-block border-right">
                    <button type="button" disabled={!state?.undo_process?.length} onClick={() => this.doUndo()}>
                        <i className="icon-undo2"></i>
                    </button>
                    <button type="button" disabled={!state?.redo_process?.length} onClick={() => this.doRedo()}>
                        <i className="icon-redo2"></i>
                    </button>
                </div>
                <div className="menu-block flex-fill">
                    <label htmlFor="fillColorSelector" className="mr-2">
                        <span type="button">
                            <i className="icon-format_color_fill"></i>
                        </span>
                        <input type="color" className="d-none" id="fillColorSelector" onChange={(e) => this.changeShapeHandler(e, 'fill')} />
                    </label>
                    <label htmlFor="strokeColorSelector" className="mr-2">
                        <span type="button">
                            <i className="icon-border_color"></i>
                        </span>
                        <input type="color" className="d-none" id="strokeColorSelector" onChange={(e) => this.changeShapeHandler(e, 'stroke')} />
                    </label>
                    <select id="strokeWidthSelector" onChange={(e) => this.changeShapeHandler(e, 'strokeWidth')}>
                        {(function (rows, i, len) {
                            while (++i <= len) {
                                rows.push(<option value={i} key={i}>{i}px</option>);
                            }
                            return rows;
                        })([], 0, 50)}
                    </select>
                    <label className="custom-selectbox">
                        <div className="box-container" onClick={() => this.toggleDropdown('line-dropdown')}>
                            <svg viewBox="0 0 64 32" width="80" height="24">
                                <path d="M1 16 L63 16" stroke="#000" strokeWidth="2" strokeDasharray={state.activeDashArray} />
                            </svg>
                        </div>

                        <div className={state.dropdownOpen === "line-dropdown" ? "custom-selectbox-content shown" : "custom-selectbox-content"}>
                            <div className="custom-selectbox-dropdown">
                                <div className="svg-line-box" onClick={() => this.selectBorderType('0,0')}>
                                    <svg viewBox="0 0 64 32" width="80" height="24">
                                        <path d="M1 16 L63 16" stroke="#000" strokeWidth="2" strokeDasharray="0,0" />
                                    </svg>
                                </div>
                                <div className="svg-line-box" onClick={() => this.selectBorderType('5,5')}>
                                    <svg viewBox="0 0 64 32" width="80" height="24">
                                        <path d="M1 16 L63 16" stroke="#000" strokeWidth="2" strokeDasharray="5,5" />
                                    </svg>
                                </div>
                                <div className="svg-line-box" onClick={() => this.selectBorderType('5,7,15,7,15,7')}>
                                    <svg viewBox="0 0 64 32" width="80" height="24">
                                        <path d="M1 16 L63 16" stroke="#000" strokeWidth="2" strokeDasharray="5,7,15,7,15,7" />
                                    </svg>
                                </div>
                                <div className="svg-line-box" onClick={() => this.selectBorderType('23,15')}>
                                    <svg viewBox="0 0 64 32" width="80" height="24">
                                        <path d="M1 16 L63 16" stroke="#000" strokeWidth="2" strokeDasharray="23,15" />
                                    </svg>
                                </div>
                                <div className="svg-line-box" onClick={() => this.selectBorderType('5,8,2,8,15,8,2,8')}>
                                    <svg viewBox="0 0 64 32" width="80" height="24">
                                        <path d="M1 16 L63 16" stroke="#000" strokeWidth="2" strokeDasharray="5,8,2,8,15,8,2,8" />
                                    </svg>
                                </div>
                                <div className="svg-line-box" onClick={() => this.selectBorderType('15,9,2,9,2,9')}>
                                    <svg viewBox="0 0 64 32" width="80" height="24">
                                        <path d="M1 16 L63 16" stroke="#000" strokeWidth="2" strokeDasharray="15,9,2,9,2,9" />
                                    </svg>
                                </div>
                                <div className="svg-line-box" onClick={() => this.selectBorderType('10,8,25,8')}>
                                    <svg viewBox="0 0 64 32" width="80" height="24">
                                        <path d="M1 16 L63 16" stroke="#000" strokeWidth="2" strokeDasharray="10,8,25,8" />
                                    </svg>
                                </div>
                                <div className="svg-line-box" onClick={() => this.selectBorderType('2,5')}>
                                    <svg viewBox="0 0 64 32" width="80" height="24">
                                        <path d="M1 16 L63 16" stroke="#000" strokeWidth="2" strokeDasharray="2,5" />
                                    </svg>
                                </div>
                                <div className="svg-line-box" onClick={() => this.selectBorderType('2,15')}>
                                    <svg viewBox="0 0 64 32" width="80" height="24">
                                        <path d="M1 16 L63 16" stroke="#000" strokeWidth="2" strokeDasharray="2,15" />
                                    </svg>
                                </div>
                                <div className="svg-line-box" onClick={() => this.selectBorderType('2,8,15,8,15,8')}>
                                    <svg viewBox="0 0 64 32" width="80" height="24">
                                        <path d="M1 16 L63 16" stroke="#000" strokeWidth="2" strokeDasharray="2,8,15,8,15,8" />
                                    </svg>
                                </div>
                                <div className="svg-line-box" onClick={() => this.selectBorderType('5,20')}>
                                    <svg viewBox="0 0 64 32" width="80" height="24">
                                        <path d="M1 16 L63 16" stroke="#000" strokeWidth="2" strokeDasharray="5,20" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </label>
                    <label className="custom-selectbox">
                        <div className="box-container" onClick={() => this.toggleDropdown('arrow-dropdown')}>
                            <svg viewBox="0 0 64 32" width="80" height="24">
                                <path d="M1 16 L63 16" stroke="#000" strokeWidth="2" markerEnd={`url(#${state.activeArrow})`} />
                            </svg>
                        </div>

                        <div className={state.dropdownOpen === "arrow-dropdown" ? "custom-selectbox-content shown" : "custom-selectbox-content"}>
                            <div className="custom-selectbox-dropdown">
                                <div className="svg-line-box" onClick={() => this.selectArrow('arrow')}>
                                    <svg viewBox="0 0 64 32" width="80" height="24">
                                        <path d="M1 16 L63 16" stroke="#000" strokeWidth="2" markerEnd="url(#arrow)" />
                                    </svg>
                                </div>
                                <div className="svg-line-box" onClick={() => this.selectArrow('squareArrow')}>
                                    <svg viewBox="0 0 64 32" width="80" height="24">
                                        <path d="M1 16 L63 16" stroke="#000" strokeWidth="2" markerEnd="url(#squareArrow)" />
                                    </svg>
                                </div>
                                <div className="svg-line-box" onClick={() => this.selectArrow('squareFillArrow')}>
                                    <svg viewBox="0 0 64 32" width="80" height="24">
                                        <path d="M1 16 L63 16" stroke="#000" strokeWidth="2" markerEnd="url(#squareFillArrow)" />
                                    </svg>
                                </div>
                                <div className="svg-line-box" onClick={() => this.selectArrow('circleArrow')}>
                                    <svg viewBox="0 0 64 32" width="80" height="24">
                                        <path d="M1 16 L63 16" stroke="#000" strokeWidth="2" markerEnd="url(#circleArrow)" />
                                    </svg>
                                </div>
                                <div className="svg-line-box" onClick={() => this.selectArrow('circleFillArrow')}>
                                    <svg viewBox="0 0 64 32" width="80" height="24">
                                        <path d="M1 16 L63 16" stroke="#000" strokeWidth="2" markerEnd="url(#circleFillArrow)" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </label>
                </div>
            </div>
        );
    }
}
