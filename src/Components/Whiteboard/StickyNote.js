import React, { Component } from "react";

export default class StickyNote extends Component {

    dragElement = (elmnt, index) => {
        let self = this;
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        elmnt.children[0].onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();

            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {

            let { chart } = self.props.state;
            chart.chart.notes[index].top = elmnt.style.top;
            chart.chart.notes[index].left = elmnt.style.left;
            console.log('sdfdsij', chart);
            self.props.updateState({ chart });

            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    deleteStickyNote = index => {
        if (window.confirm("Are you sure to delete this sticky note?")) {
            let { chart } = this.props.state;
            chart.chart.notes.splice(index, 1);
            this.props.updateState({ chart });
        }
    }
    setUpdate = (e, index) => {
        let { chart } = this.props.state;
        chart.chart.notes[index].text = e.target.value;
        this.props.updateState({ chart });
    }

    render() {
        if (this.props.notes) {
            let sticky_notes = document.querySelectorAll('.sticky');
            for (let i = 0; i < sticky_notes.length; i++) {
                this.dragElement(sticky_notes[i], i);
            }
        }
        return (
            <div className={`sticky-groups`}>
                {
                    this.props.notes && this.props.notes.map((note, index) => {
                        return <div className={"sticky bg-" + note.color} key={index} style={{ top: note.top, left: note.left }}>
                            <div className="sticky-header">
                                <i className="icon-move"></i>
                                <div>
                                    <i className="icon-trash" onClick={() => this.deleteStickyNote(index)}></i>
                                </div>
                            </div>
                            <div className="sticky-body">
                                <textarea placeholder="Add your notes..." onInput={(e) => this.setUpdate(e, index)}>{note.text}</textarea>
                            </div>
                        </div>
                    })
                }
            </div>
        );
    }
}