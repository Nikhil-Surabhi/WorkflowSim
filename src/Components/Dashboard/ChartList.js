import { Component } from "react";
import { foramatedDate } from "../../Configs/date.config";
import { ChartSvgImage } from "../../Views/ChartSvgImage";
import { SvgImage } from "../../Views/SvgImage";

export default class ChartList extends Component {
    render() {
        let self = this;
        let ch = this.props.template;

        // console.log(ch);

        return (
            <div className="col-sm-3 mb-3">
                <div className="card overflow-hidden">
                    <div className="card-body">
                        <ChartSvgImage id={ch.chart_id} height={150} template={ch} />
                        <div className="py-3">
                            <h4>{ch.chart_name && ch.chart_name.trim() !== '' ? ch.chart_name : "Blank diagram"}</h4>
                            <span style={{ position: 'absolute', top: 35, right: 20, zIndex: 999 }}>
                                <i className={ch.is_starred ? "icon-star-full" : "icon-star-empty"} style={{ cursor: 'pointer' }} onClick={() => self.props.isStarredChart(ch)}></i>
                            </span>
                            <span className="bg-secondary rounded px-2 text-white">
                                {ch.product === "FC" ? "Flowchart" : "Whiteboard"}
                            </span>
                            <div>
                                <i className="icon-user2"></i> {ch.name}
                            </div>
                            <div>
                                <i className="icon-clock1"></i> {foramatedDate(ch.date_modified)}
                            </div>
                            {
                                ch.access_type ?
                                    <div>
                                        <i className="icon-share2"></i> {ch.access_type}
                                    </div>
                                    : <></>
                            }
                        </div>
                    </div>
                    <div className="p-3 bg-dark text-white card-heading">
                        {!ch.access_type || ch.access_type === "EDIT" ? "Edit" : "Open"} Now
                    </div>
                    <a href={ch.product === "FC" ? `canvas/${ch.chart_id}` : `whiteboard/${ch.chart_id}`}></a>
                </div>
            </div>
        );
    }
}