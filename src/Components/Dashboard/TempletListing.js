import React, { Component } from "react"
import { addUpdateChart, addUpdateTemplets } from "../../Api/chart.api";
import { foramatedDate } from "../../Configs/date.config";
import { SvgImage } from "../../Views/SvgImage";
import FlowchartConnector from "../FlowchartConnector";
import FlowchartResizeNode from "../FlowchartResizeNode";

export default class TempletListing extends Component {
    state = {
        starred_view: false,
        recent_view: false,
        mychart_view: false,
        shared_view: false,
        templet_view: false,
        allchart_view: false,
    }
    isStarredChart = (data) => {
        data.is_starred = !data.is_starred;
        this.props.onGoTo(data);
    }
    createChart = async (type = "FC", chart) => {
        let json = {
            "chart_id": null,
            "product": type,
            "is_template": false,
            "is_starred": false,
            "pages_id": null,
            chart,
            "page_name": "Page 1",
            "chart_name": "Blank diagram"
        }
        // let json = {
        //     "template_id": 1003,
        //     "product": type,
        //     "template_description": 'Test11',
        //     "is_active": true,
        //     "category": 'ABCD',
        //     "chart": {},
        //     "created_user_id": 1003,
        //     "modified_by": 1003,
        //     "title": "Test Template"
        // }
        // let response = await addUpdateTemplets(json);
        // console.log('response', response);
        let response = await addUpdateChart(json);
        if (response.success) {
            type === "FC"
                ? this.props.history.push(`/canvas/${response.data.data.chart_id}`)
                : this.props.history.push(`/whiteboard/${response.data.data.chart_id}`);
        } else {
            // alert(response.data.msg);
        }
    }
    render() {
        let self = this;
        return (
            <>
                <div className="row">
                    {
                        this.props.charts.map(function (ch, j) {
                            return <div className="col-sm-3 mb-3" key={j}>
                                <div className="card overflow-hidden">
                                    <div className="card-body" style={{ backgroundColor: '#ccc' }}>
                                        {/* <img src={'blob:https://localhost:3000/42e307a2-ab12-46eb-99a4-15b6fb9e54d2'} alt="logo" style={{ width: "100%", cursor: "pointer" }}></img> */}
                                        <SvgImage id={ch.template_id} height={150} template={ch} />
                                    </div>
                                    <div className="p-3 bg-dark text-white card-heading">
                                        {ch.title && ch.title.trim() !== '' ? ch.title : "Blank diagram"}
                                    </div>
                                    {/* <a href="#" onClick={() => self.createChart('FC')} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}></a> */}
                                    <a href={"#exampleModal" + ch.template_id} data-toggle="modal" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}></a>
                                </div>

                                {/* <!-- Modal --> */}
                                <div className="modal fade" id={"exampleModal" + ch.template_id}>
                                    <div className="modal-dialog modal-dialog-centered" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">{ch.title && ch.title.trim() !== '' ? ch.title : "Blank diagram"}</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <SvgImage id={ch.template_id} height={600} template={ch} />
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => self.createChart('FC', ch.chart)}>Use Template</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </div>
            </>
        );
    }
}
