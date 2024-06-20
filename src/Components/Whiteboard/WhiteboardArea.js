import { Component } from "react";
import { fabric } from 'fabric';
import WhiteboardLeftSidebar from './LeftSidebar';
import StickyNote from "./StickyNote";

export default class WhiteboardArea extends Component {
    state = {
        whiteboardCanvas: null,
        notes: [],
        cursor: {
            left: 0,
            top: 0
        },
        size: 1
    }

    updateChartData = () => {
        // console.log('sdjh shdfdjfjds sdfsdj');
        let { whiteboardCanvas } = this.state
        let { chart } = this.props.state;
        chart.chart.data = whiteboardCanvas;

        this.props.updateState({ chart });
    }

    getMousePos1 = (canvas, evt) => {
        var rect = canvas.getBoundingClientRect();
        return {
            canvasX: evt.clientX - rect.left,
            canvasY: evt.clientY - rect.top
        };
    }

    getMousePos = (canvas, e) => {
        var pos = canvas.getPointer(e);
        return pos;
    }

    updateNotes = notes => {
        let self = this;
        let { chart } = this.props.state;
        this.setState({ notes });

        setTimeout(() => {
            console.log('notes : ', notes);
            var chart_notes = [...notes]
            // chart_notes.map(note => {
            //     delete note.editorState;
            // });
            let note;
            for (let index in chart_notes) {
                note = chart_notes[index];
                delete note.editorState;
                // console.log('note: ', note);
                chart_notes[index] = note;
            }
            chart.chart.notes = chart_notes;
            // console.log('Update Notes', chart_notes);
            self.props.updateState({ chart });
        }, 100);

    }

    componentDidMount() {
        let self = this;
        let { state } = this.props
        // console.log('chart', state.chart);
        if (state.chart.chart && state.chart.chart.notes) {
            // console.log('notes: ', state.chart.chart.notes);
            this.setState({ notes: state.chart.chart.notes });
        }

        // Fill Window Width and Height
        const { innerWidth: width, innerHeight: height } = window;

        var whiteboardCanvas = new fabric.Canvas('whiteboardCanvas', {
            selection: false,
            isDrawingMode: true,
            width,
            height
        });

        if (state.chart && state.chart.chart && state.chart.chart.data) {
            whiteboardCanvas.loadFromJSON(state.chart.chart.data, () => {
                whiteboardCanvas.renderAll();
            });
        }

        fabric.Object.prototype.selectable = false;
        fabric.Object.prototype.erasable = true;
        this.setState({ whiteboardCanvas });


        // Mouse Event Handlers
        if (whiteboardCanvas) {
            var isDown = false;

            let initial = {
                x: null,
                y: null
            }
            var rect, ellipse;
            var WIDTH;
            var HEIGHT;

            // var recDim = null;

            whiteboardCanvas.on('mouse:down', o => {
                state = this.props.state;

                isDown = true;
                let { x, y } = self.getMousePos(whiteboardCanvas, o.e);

                initial = { x, y }

                if (state.mode === 'pencil' || state.mode === 'eraser') {
                    whiteboardCanvas.isDrawingMode = 1;
                    whiteboardCanvas.freeDrawingBrush.color = state.mode === 'eraser' ? '#fff' : state.penColor;
                    // whiteboardCanvas.freeDrawingBrush.width = state.mode === 'eraser' ? 20 : 10;
                } else {
                    whiteboardCanvas.isDrawingMode = 0;
                }

                if (state.mode === 'rectangle') {
                    rect = new fabric.Rect({
                        left: x,
                        top: y,
                        originX: 'left',
                        originY: 'top',
                        width: 0,
                        height: 0,
                        angle: 0,
                        fill: 'rgba(255,255,255,0)',
                        stroke: state.penColor,
                        strokeWidth: 10,
                        transparentCorners: false,
                        hasRotatingPoint: false
                    });

                    whiteboardCanvas.add(rect);
                }

                if (state.mode === 'circle') {
                    ellipse = new fabric.Ellipse({
                        left: x,
                        top: y,
                        originX: 'left',
                        originY: 'top',
                        rx: 0,
                        ry: 0,
                        angle: 0,
                        fill: 'rgba(255,255,255,0)',
                        stroke: state.penColor,
                        strokeWidth: 10,
                        transparentCorners: false,
                        hasRotatingPoint: false
                    });

                    whiteboardCanvas.add(ellipse);
                }

            });

            whiteboardCanvas.on('mouse:move', o => {
                state = this.props.state;
                let { x, y } = self.getMousePos(whiteboardCanvas, o.e);
                // console.log('cursor: ', cursor);

                setTimeout(function () {
                    self.setState({ cursor: { left: x, top: y } });

                }, 10);
                if (!isDown) return;

                WIDTH = Math.abs(initial.x - x);
                HEIGHT = Math.abs(initial.y - y);

                if (state.mode === 'rectangle') {
                    if (initial.x > x) {
                        rect.set({ left: Math.abs(x) })
                    }

                    if (initial.y > y) {
                        rect.set({ top: Math.abs(y) })
                    }

                    rect.set({
                        width: WIDTH,
                        height: HEIGHT
                    });
                }

                if (state.mode === 'circle') {

                    ellipse.set({
                        rx: WIDTH / 2,
                        ry: HEIGHT / 2
                    });
                }

                whiteboardCanvas.renderAll();
            });

            whiteboardCanvas.on('mouse:up', o => {
                isDown = false
                initial = null

                this.setState({ whiteboardCanvas });

                this.updateChartData();
            });
        }
    }

    render() {

        let { state } = this.props;

        // console.log('notes:', state.chart.notes);

        return (
            <>
                <WhiteboardLeftSidebar {...this.props} whiteboardCanvas={this.state.whiteboardCanvas} updateState={json => this.props.updateState(json)} updateSize={size => this.setState({ size })} />
                <div className={"canvas-area " + state.mode}>
                    <canvas id="whiteboardCanvas">
                        Sorry, your browser does not support HTML5 canvas technology.
                    </canvas>
                    {
                        // state.mode === 'sticky-note' || this.state.notes.length ?
                        // <div className={`sticky-groups${state.mode === 'sticky-note' ? ' active' : ''}`}>
                        //     {/* <ReactStickies
                        //         notes={this.state.notes}
                        //         onChange={this.updateNotes}
                        //     /> */}
                        //     {
                        //         state.chart.notes && state.chart.notes.map((note, index) => {
                        //             return <div className={"sticky bg-" + note.color} key={index}>
                        //                 <div className="sticky-header">
                        //                     <i className="icon-move"></i>
                        //                     <div>
                        //                         <i className="icon-trash"></i>
                        //                     </div>
                        //                 </div>
                        //                 <div className="sticky-body">
                        //                     <textarea placeholder="Add your notes...">{ note.text }</textarea>
                        //                 </div>
                        //             </div>
                        //         })
                        //     }
                        // </div>
                        // : <></>
                        <StickyNote {...this.props} updateState={(state) => { this.updateNotes(state.chart.chart.notes); this.props.updateState(state) }} notes={state.chart.chart.notes} />
                    }
                    {
                        state.mode === 'pencil' || state.mode === 'eraser' ?
                            <div className="custom-cursor" style={{
                                width: this.state.size,
                                height: this.state.size,
                                left: this.state.cursor.left,
                                top: this.state.cursor.top,
                                marginLeft: - this.state.size / 2,
                                marginTop: - this.state.size / 2,
                                borderRadius: state.mode === 'eraser' ? 0 : '50%',
                                backgroundColor: state.mode === 'eraser' ? '#ebebeb' : state.penColor,
                            }}></div>
                            : <></>
                    }
                </div>
            </>
        );
    }
}