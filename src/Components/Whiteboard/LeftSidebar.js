import { Component } from "react";
import { fabric } from 'fabric';

export default class WhiteboardLeftSidebar extends Component {
    changeMode = (mode, size = 10) => {
        let { whiteboardCanvas, state } = this.props;

        if (mode === 'pencil' || mode === 'eraser') {
            // if(mode === 'pencil') {
            //     whiteboardCanvas.freeDrawingBrush = new fabric.PencilBrush(whiteboardCanvas);
            // } else {
            //     whiteboardCanvas.freeDrawingBrush = new fabric.CircleBrush(whiteboardCanvas);
            // }

            whiteboardCanvas.isDrawingMode = 1;
            whiteboardCanvas.freeDrawingBrush.color = mode === 'eraser' ? '#fff' : state.penColor;
            whiteboardCanvas.freeDrawingBrush.width = size;

        } else {
            whiteboardCanvas.isDrawingMode = 0;
        }

        this.props.updateSize(size);

        this.props.updateState({
            state,
            mode,
            whiteboardCanvas
        });
    }
    addSticky = color => {
        let { chart } = this.props.state
        let left = 0;
        if (!chart.chart.notes || !chart.chart.notes.length) {
            left = (window.innerWidth - 255) + 'px';
        } else {
            let last = chart.chart.notes[chart.chart.notes.length - 1]
            left = parseFloat(last.left.substring(0, last.left.length, -2)) - 255 + 'px';
            console.log('left: ', last.left.substring(0, last.left.length, -2));
        }


        chart.chart.notes = chart.chart.notes ?? [];
        chart.chart.notes.push({
            color,
            text: '',
            left,
            top: '5px'
        });
        this.props.updateState({ chart });
    }
    updateNotes = notes => {
        this.props.updateNotes(notes);
    }
    render() {
        let { state } = this.props;

        return (
            <div className="whiteboard-icons">
                <div className='whiteboard-btn-group'>
                    {/* <button className="btn btn-block" onClick={() => this.changeMode('sticky-note')}>
                        <i className='icon-sticky-note-o'></i><br />Sticky Note
                    </button> */}
                    <ul>
                        <li>
                            <i className='icon-sticky-note-o'></i> Sticky Note
                            <div className="whiteboard-icons-hover">
                                <div className="icons-dropdown-body">
                                    <button type="button" className="bg-yellow" onClick={() => this.addSticky('yellow')}>
                                        <i className='icon-sticky-note-o'></i>
                                    </button>
                                    <button type="button" className="bg-green" onClick={() => this.addSticky('green')}>
                                        <i className='icon-sticky-note-o'></i>
                                    </button>
                                    <button type="button" className="bg-pink" onClick={() => this.addSticky('pink')}>
                                        <i className='icon-sticky-note-o'></i>
                                    </button>
                                    <button type="button" className="bg-perple" onClick={() => this.addSticky('perple')}>
                                        <i className='icon-sticky-note-o'></i>
                                    </button>
                                    <button type="button" className="bg-blue" onClick={() => this.addSticky('blue')}>
                                        <i className='icon-sticky-note-o'></i>
                                    </button>
                                </div>
                            </div>
                        </li>
                        <li>
                            <i className='icon-pencil'></i> Pencil
                            <div className="whiteboard-icons-hover">
                                <div className="icons-dropdown-body">
                                    <button type="button" onClick={() => this.changeMode('pencil', 1)}>
                                        <img src="/005-pencil-1.png" />
                                    </button>
                                    <button type="button" onClick={() => this.changeMode('pencil', 5)}>
                                        <img src="/001-pencil.png" />
                                    </button>
                                    <button type="button" onClick={() => this.changeMode('pencil', 8)}>
                                        <img src="/002-pen.png" />
                                    </button>
                                    <button type="button" onClick={() => this.changeMode('pencil', 10)}>
                                        <img src="/003-highlighter.png" />
                                    </button>
                                    <button type="button" onClick={() => this.changeMode('pencil', 15)}>
                                        <img src="/004-paint-brush.png" />
                                    </button>
                                </div>
                            </div>
                        </li>
                        <li>
                            <i className='icon-eraser'></i> Eraser
                            <div className="whiteboard-icons-hover">
                                <div className="icons-dropdown-body">
                                    <button type="button" onClick={() => this.changeMode('eraser', 5)}>
                                        <i className="icon-circle" style={{ fontSize: 8 }}></i>
                                    </button>
                                    <button type="button" onClick={() => this.changeMode('eraser', 10)}>
                                        <i className="icon-circle" style={{ fontSize: 10 }}></i>
                                    </button>
                                    <button type="button" onClick={() => this.changeMode('eraser', 15)}>
                                        <i className="icon-circle" style={{ fontSize: 12 }}></i>
                                    </button>
                                    <button type="button" onClick={() => this.changeMode('eraser', 20)}>
                                        <i className="icon-circle" style={{ fontSize: 14 }}></i>
                                    </button>
                                    <button type="button" onClick={() => this.changeMode('eraser', 25)}>
                                        <i className="icon-circle" style={{ fontSize: 16 }}></i>
                                    </button>
                                </div>
                            </div>
                        </li>
                        <li>
                            <i className='icon-square-o'></i> Shapes
                            <div className="whiteboard-icons-hover">
                                <div className="icons-dropdown-body">
                                    <button type="button" onClick={() => this.changeMode('rectangle')}>
                                        <i className="icon-square-o" ></i>
                                    </button>
                                    <button type="button" onClick={() => this.changeMode('circle')}>
                                        <i className="icon-circle-o" ></i>
                                    </button>
                                </div>
                            </div>
                        </li>
                    </ul>
                    {/* <button className="btn btn-block" onClick={() => this.changeMode('eraser')}>
                        <i className='icon-eraser'></i> Eraser
                    </button> */}
                    {/* <button className="btn btn-block" onClick={() => this.changeMode('rectangle')}>
                        <i className='icon-square-o'></i> Rectangle
                    </button>
                    <button className="btn btn-block" onClick={() => this.changeMode('circle')}>
                        <i className='icon-circle-o'></i> Circle
                    </button> */}
                </div>
                <div style={{ marginTop: 7 }}>
                    <input type="color" value={state.penColor} onChange={e => this.props.updateState({ penColor: e.target.value })} style={{ width: '100%', height: 40 }} />
                </div>
            </div>
        );
    }
}