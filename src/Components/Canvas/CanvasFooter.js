import { Component } from "react";
import { addUpdateChart, getChartInfo } from "../../Api/chart.api";
import { getFlowchart } from "../../Api/flowchart.api";

export default class CanvasFooter extends Component {
    toggleDropdown = name => {
        let state = this.props.state;
        if (state.dropdownOpen && state.dropdownOpen === name) {
            this.props.setStateValue({ dropdownOpen: null });
        } else {
            this.props.setStateValue({ dropdownOpen: name });
        }
    }
    zoomHandler = zoom => {
        let w = this.props.state.base_chart_width,
            h = this.props.state.base_chart_height;

        this.props.setStateValue({
            zoom: zoom,
            svg_chart_width: w + (w * zoom / 100),
            svg_chart_height: h + (h * zoom / 100)
        })

        setTimeout(() => {
            this.getCanvasChartSpacing();
        }, 10);
    }

    chartZoom = e => {
        this.zoomHandler(e.target.value)
    }

    zooming = (type) => {
        let state = this.props.state;
        let zoom = state.zoom;
        zoom = parseFloat(zoom);
        if (type === 'in') {
            zoom += 10;
            zoom = zoom < 200 ? zoom : 200;
        } else if (zoom > -70) {
            zoom -= 10;
            zoom = zoom > -70 ? zoom : -70;
        }

        this.zoomHandler(zoom);
    }

    getCanvasChartSpacing() {
        let state = this.props.state;

        let canvas = document.querySelector('.canvas-area');
        // let    chart = document.querySelector('#chart');

        let styles = {};

        if (canvas.clientWidth > state.svg_chart_width) {
            styles.inset = `10px 0 10px ${(canvas.clientWidth - state.svg_chart_width) / 2}px`;
        } else {
            styles.inset = `10px 0 10px 0`;
        }

        let scrollBarWidth = canvas.offsetWidth - canvas.clientWidth,
            scrollBarHeight = canvas.offsetHeight - canvas.clientHeight;

        if (scrollBarWidth <= 0) {
            scrollBarWidth = canvas.clientWidth;
        }

        if (scrollBarHeight <= 0) {
            scrollBarHeight = canvas.clientHeiscrollBarHeight;
        }

        let mw = (canvas.scrollWidth - canvas.clientWidth) / canvas.scrollWidth,
            mh = (canvas.scrollHeight - canvas.clientHeight) / canvas.scrollHeight,
            offsetLeft = canvas.scrollLeft / canvas.scrollWidth,
            offsetTop = canvas.scrollTop / canvas.scrollHeight;

        mw = 168 - 168 * mw;
        mh = 119 - 119 * mh;
        offsetLeft = 168 * offsetLeft;
        offsetTop = 119 * offsetTop;

        // console.log(mw);

        mw = mw > 5 ? mw : 5;
        mh = mh > 5 ? mh : 5;
        if (offsetLeft <= 15) {
            offsetLeft = 15;
        }
        if (offsetTop <= 15) {
            offsetTop = 15;
        }

        if (offsetLeft > 200 - 15) {
            offsetLeft = 200 - 15;
        }
        if (offsetTop > 149 - 15) {
            offsetTop = 149 - 15;
        }


        this.props.setStateValue({
            minchart_style: {
                width: `${mw}px`,
                height: `${mh}px`,
                left: offsetLeft,
                top: offsetTop
            },
            svg_chart_styles: styles
        });

        this.dragElement(document.getElementById('picture-in-picture-handle'));
    }
    dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
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
            let top = (elmnt.offsetTop - pos2) > 15 ? (elmnt.offsetTop - pos2) : 15;
            let left = (elmnt.offsetLeft - pos1) > 15 ? (elmnt.offsetLeft - pos1) : 15;

            if (top > 134 - elmnt.offsetHeight) {
                top = 134 - elmnt.offsetHeight;
            }
            if (left > 183.4 - elmnt.offsetWidth) {
                left = 183.4 - elmnt.offsetWidth;
            }

            elmnt.style.top = top + "px";
            elmnt.style.left = left + "px";

            var canvas = document.querySelector(".canvas-area");

            let offsetLeftPercent = (left - 15) / 168.4;
            let offsetTopPercent = (top - 15) / 119;

            canvas.scrollLeft = canvas.scrollWidth * offsetLeftPercent
            canvas.scrollTop = canvas.scrollHeight * offsetTopPercent
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    updatePageName = (name, index) => {
        let pages = this.props.state.pages;
        pages[index].page_name = name;
        this.props.setStateValue({
            pages
        });
    }

    addPage = async () => {
        let { state } = this.props;
        let pageNum = state.pages ? state.pages.length + 1 : 1;
        let json = state.chart;
        json.pages_id = null;
        json.page_name = "Page " + pageNum;
        json.chart = {};

        let response = await addUpdateChart(json);

        if (response.success) {
            let chart = response.data.data;
            this.props.setStateValue({
                nodes: chart.chart,
                chart_name: chart.chart_name ?? "Blank diagram",
                pages: chart.pages,
                chart: chart
            });
        }
    }

    setActivePage = async pageNum => {
        let { state } = this.props;
        let chart = await getChartInfo(state.chart.chart_id, pageNum);
        if (chart.success) {
            chart = chart.data;
            this.props.setStateValue({
                nodes: chart.chart,
                chart_name: chart.chart_name ?? "Blank diagram",
                chart: chart,
                currentPage: pageNum
            });
        }

        let response = await getFlowchart(chart.pages_id)
        this.props.setStateValue({ workflows: response.data });
    }

    componentWillUpdate(nextProps, nextState) {
        var svg = document.querySelector("#chart svg");
        document.getElementById('mini-chart-svg').innerHTML = svg.innerHTML;
    }

    componentDidMount() {

        this.getCanvasChartSpacing();

        this.dragElement(document.getElementById('picture-in-picture-handle'));
    }

    render() {
        let state = this.props.state;
        let self = this;

        // console.log('pages', state.pages);

        let pages = state.pages ? state.pages.sort((a, b) => {
            if (a.page_num < b.page_num) {
                return -1;
            } else {
                return 1;
            }
        }) : [];

        return (
            <div className="canvas-footer-bar d-flex">
                <div className="menu-block flex-fill d-flex align-items-center" style={{ marginTop: '-5px' }}>
                    {
                        pages && pages.map(function (page, pageKey) {
                            if (state.currentPage === page.page_num) {
                                return <span className="page-tab active" key={pageKey}>
                                    <input type="text" value={page.page_name} className="page-name" onInput={e => self.updatePageName(e.target.value, pageKey)} style={{
                                        minWidth: 50,
                                        width: (page.page_name.length + 1) * 8
                                    }} />
                                </span>
                            } else {
                                return <span
                                    className="page-tab"
                                    style={{ cursor: 'pointer' }}
                                    key={pageKey}
                                    onClick={() => self.setActivePage(page.page_num)}
                                >
                                    {page.page_name}
                                </span>
                            }
                        })
                    }
                    <span
                        className="page-add-btn"
                        onClick={() => this.addPage()}
                    ><i className="icon-plus2"></i></span>
                </div>
                <div className="menu-block border-right" style={{ padding: '3px 5px', marginBottom: '-5px', position: 'relative' }}>
                    <button type="button" onClick={() => this.toggleDropdown('picture-in-picture')}>
                        <i className="icon-zoom-in1"></i>
                    </button>
                    <div className={
                        state.dropdownOpen && state.dropdownOpen === "picture-in-picture"
                            ? "picture-in-picture shown"
                            : "picture-in-picture"
                    }
                        onMouseUp={this.stopLensDrag}
                    >
                        <div id="picture-in-picture-container">
                            <svg
                                width={168.4}
                                height={119}
                                viewBox={'0 0 842 595'}
                                id="mini-chart-svg"
                            ></svg>
                        </div>
                        <div
                            id="picture-in-picture-handle"
                            style={state.minchart_style}
                        ></div>
                    </div>
                </div>
                <div className="menu-block border-right" style={{ padding: '3px 5px', marginBottom: '-5px' }}>
                    <button type="button" disabled={state.zoom === -70} onClick={() => this.zooming('out')}>
                        <i className="icon-minus-circle1"></i>
                    </button>
                    <input type="range" min="-70" max="200" value={state.zoom} onChange={this.chartZoom} />
                    <button type="button" disabled={state.zoom === 200} onClick={() => this.zooming('in')}>
                        <i className="icon-plus-circle1"></i>
                    </button>
                </div>
                <div className="menu-block">
                    <span className="px-3">{state.zoom}%</span>
                </div>
            </div>
        );
    }
}
