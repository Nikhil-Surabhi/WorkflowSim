import React, { Component } from "react"
import { addUpdateChart, addUpdateTemplets, getCharts } from "../Api/chart.api"
import Header from "../Components/Header"
import Sidebar from "../Components/Sidebar"
import ChartListing from "../Components/Dashboard/ChartListing";
import Loading from "../Components/Loading";

export default class Dashboard extends Component {
    state = {
        charts: [],
        loading: true,
        inputField: ''
    }
    async componentDidMount() {
        this.getCharts();
    }
    getCharts = async () => {
        let res = await getCharts();
        this.setState({ loading: false });
        if (res && res.success) {
                this.setState({
                    charts: res.data
                })
        }
    }
    updateChart = async (data) => {
        // console.log('data', data);
        let response = await addUpdateChart(data);
        if (response.success) {
            this.getCharts();
        }
    }

    render() {
        return (
            <div>
                <Header {...this.props} inputText={this.state.inputField} getSearchResults={(e) => this.setState({ inputField: e.target.value })} />
                <div className="d-flex">
                    <Sidebar {...this.props} />
                    <div className="dashboard-content bg-light">
                        {
                            !this.state.loading
                                ?
                                    this.state.charts.length
                                        ? <ChartListing searchTerm={this.state.inputField} charts={this.state.charts} onGoTo={(data) => this.updateChart(data)} />
                                        : <div>No charts owned by you yet.</div>
                                : <Loading />
                        }
                    </div>
                </div>
            </div>
        )
    }
}
