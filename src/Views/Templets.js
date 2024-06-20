import React, { Component } from "react"
import { addUpdateChart, addUpdateTemplets, getTemplets } from "../Api/chart.api"
import Header from "../Components/Header"
import Sidebar from "../Components/Sidebar"
import Loading from "../Components/Loading";
import TempletListing from "../Components/Dashboard/TempletListing";

export default class Templets extends Component {
    state = {
        charts: [],
        loading: true
    }
    async componentDidMount() {
        this.getCharts();
    }
    getCharts = async () => {
        let res = await getTemplets();
        console.log('templets', res);
        this.setState({ loading: false });

        if (res.success) {
            this.setState({
                charts: res.data
            })
        }
    }
    updateChart = async (data) => {
        console.log('data', data);
        // let response = await addUpdateTemplets(data);
        // if (response.success) {
        //     this.getCharts();
        // }
    }
    render() {
        return (
            <div>
                <Header {...this.props} />
                <div className="d-flex">
                    <Sidebar {...this.props} />
                    <div className="dashboard-content bg-light">
                        {
                            !this.state.loading
                                ?
                                this.state.charts.length
                                    ? <TempletListing {...this.props} charts={this.state.charts} onGoTo={(data) => this.updateChart(data)} />
                                    : <div>No templets owned by you yet.</div>
                                : <Loading />
                        }
                    </div>
                </div>
            </div>
        )
    }
}
