import { Component } from 'react';
import { addUpdateChart, getChartInfo } from '../Api/chart.api';
import WhiteboardHeader from '../Components/Whiteboard/Header';
import WhiteboardArea from '../Components/Whiteboard/WhiteboardArea';

class Whiteboard extends Component {
    state = {
        mode: 'pencil',
        penColor: '#ff0000',
        chart: {},
        save_status: false
    }

    updateState = json => {
        let self = this;
        this.setState(json);
        // console.log('json', json);

        setTimeout(() => {
            self.saveCanvas();
        }, 100);
    }

    saveCanvas = () => {
        let { chart } = this.state;

        this.setState({ save_status: true });
        console.log('save status 1', this.state.save_status);
        let res = addUpdateChart(chart);
        // console.log('res', res);

        this.setState({ save_status: false });
        // this.getCharts();
        console.log('save status 2', this.state.save_status);
    }

    componentDidMount = async () => {
        this.getCharts();
    }
    getCharts = async () => {
        let { whiteboardId } = this.props.match.params;
        let chart = await getChartInfo(whiteboardId);

        this.setState({ chart: chart.data });
        // console.log('chart.data', chart.data);
    }

    render() {
        return (
            <div className='canvas-screen whiteboard'>
                {
                    this.state.chart.chart
                        ? <>
                            <WhiteboardHeader {...this.props} state={this.state} updateState={json => this.updateState(json)} />

                            <div className="d-flex chart-main-content">
                                <WhiteboardArea {...this.props} state={this.state} updateState={json => this.updateState(json)} />
                            </div>
                        </>
                        : <></>
                }
            </div>
        );
    }
}

export default Whiteboard;
