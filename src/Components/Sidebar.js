import React, { Component } from "react";
import { Link } from "react-router-dom";
import { addUpdateChart } from "../Api/chart.api";

export default class Sidebar extends Component {
    createChart = async (type = "FC") => {
        let json = {
            "chart_id": null,
            "product": type,
            "is_template": false,
            "is_starred": false,
            "pages_id": null,
            "chart": {},
            "page_name": "Page 1",
            "chart_name": "Blank diagram"
        }
        let response = await addUpdateChart(json);

        if (response.success) {
            type === "FC"
                ? this.props.history.push(`/canvas/${response.data.data.chart_id}`)
                : this.props.history.push(`/whiteboard/${response.data.data.chart_id}`);
        } else {
            // alert(response.data.msg);
        }
    }
    async componentDidMount() {
        var element = document.querySelector(".sub-dropdown");
        var element1 = document.querySelector(".sub-dropdown-menu");
        element.addEventListener('mouseover', function (e) {
            element1.setAttribute("style", "display:block;")
        }, false);
        element.addEventListener('mouseout', function (e) {
            element1.setAttribute("style", "display:none;")
        }, false);

        element1.addEventListener('mouseover', function (e) {
            element1.setAttribute("style", "display:block;")
        }, false);
        element1.addEventListener('mouseout', function (e) {
            element1.setAttribute("style", "display:none;")
        }, false);
    }

    render() {
        return (
            <aside className="dashboard-sidebar">
                <div className="d-grid">
                    <div className="btn-group w-100">
                        <button type="button" className="btn btn-dark d-block dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            + Create
                        </button>
                        <div className="dropdown-menu w-100">
                            <button class="dropdown-item sub-dropdown">NEW FLOWCHART</button>
                            <button onClick={() => this.createChart('WB')} class="dropdown-item">NEW WHITEBOARD</button>
                        </div>
                    </div>
                    <div>
                        <ul class="sub-dropdown-menu" style={{ display: 'none' }}>
                            <button onClick={() => this.createChart('FC')} class="dropdown-item">NEW FLOWCHART</button>
                            <Link to="/templets" class="dropdown-item">NEW TEMPLETE</Link>
                        </ul>
                    </div>
                </div>

                <ul>
                    <li>
                        <Link to="/">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/">For You</Link>
                    </li>
                    <li>
                        <Link to="/templets">Templates</Link>
                    </li>
                </ul>
                <button className="btn btn-success btn-block">Upgrade</button>
            </aside>
        );
    }
}
