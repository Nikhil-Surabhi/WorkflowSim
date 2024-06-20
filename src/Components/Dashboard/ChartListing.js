import React, { Component } from "react"
import { foramatedDate } from "../../Configs/date.config";
import { SvgImage } from "../../Views/SvgImage";
import ChartList from "./ChartList";

export default class ChartListing extends Component {
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
    render() {
        let self = this;
        return (
            <>
                {/* Starred Charts */}
                {
                    this.props.charts.map(function (row, i) {
                        if (i == 0) {
                            return (
                                <div key={i} >
                                    <div>
                                        <h5 style={{ float: 'left', textAlign: 'right' }}>Starred Charts</h5>
                                        {
                                            row.data && row.data.filter(li => li.is_starred == true).length && row.data.filter(li => li.is_starred == true).length > 4 ?
                                                <>
                                                    {
                                                        self.state.starred_view ?
                                                            <div style={{ float: 'right', textAlign: 'right', cursor: 'pointer' }} onClick={() => self.setState({ starred_view: false })}>view less</div>
                                                            :
                                                            <div style={{ float: 'right', textAlign: 'right', cursor: 'pointer' }} onClick={() => self.setState({ starred_view: true })}>view more</div>
                                                    }
                                                </>
                                                : ''
                                        }
                                        <div class="clearfix"></div>
                                    </div>
                                    {
                                        row.data && row.data.filter(li => li.is_starred === true).length
                                            ? <div className="row dashboard-blocks">
                                                {
                                                    row.data.filter(li => li.is_starred == true).filter((ch) => {
                                                        if(self?.props?.searchTerm === '') {
                                                            return ch;
                                                        } else if(ch?.chart_name?.toLowerCase().includes(self?.props?.searchTerm?.toLowerCase())) {
                                                            return ch;
                                                        }
                                                    }).map((ch, j) => {
                                                        if (self.state.starred_view) {
                                                            return <ChartList {...self.props} template={ch} isStarredChart={(ch) => self.isStarredChart(ch)} key={j} />
                                                        } else {
                                                            if (j < 4) {
                                                                return <ChartList {...self.props} template={ch} isStarredChart={(ch) => self.isStarredChart(ch)} key={j} />
                                                            }
                                                        }
                                                    })
                                                }
                                            </div>
                                            : <div>No records in <strong>Starred Charts</strong>.</div>
                                    }

                                </div>
                            )
                        }
                    })
                }
                {/* Recent Charts */}
                {
                    this.props.charts.map(function (row, i) {
                        if (i == 0) {
                            return (
                                <div key={i} style={{ marginTop: 30 }}>
                                    <div>
                                        <h5 style={{ float: 'left', textAlign: 'right' }}>Recent Charts</h5>
                                        {
                                            row.data && row.data.length && row.data.length > 4 ?
                                                <>
                                                    {
                                                        self.state.recent_view ?
                                                            <div style={{ float: 'right', textAlign: 'right', cursor: 'pointer' }} onClick={() => self.setState({ recent_view: false })}>view less</div>
                                                            :
                                                            <div style={{ float: 'right', textAlign: 'right', cursor: 'pointer' }} onClick={() => self.setState({ recent_view: true })}>view more</div>
                                                    }
                                                </>
                                                : ''
                                        }
                                        <div class="clearfix"></div>
                                    </div>
                                    {
                                        row.data && row.data.length
                                            ? <div className="row dashboard-blocks">
                                                {
                                                    row.data.filter((ch) => {
                                                        if(self?.props?.searchTerm === '') {
                                                            return ch;
                                                        } else if(ch?.chart_name?.toLowerCase().includes(self?.props?.searchTerm?.toLowerCase())) {
                                                            return ch;
                                                        }
                                                    }).map((ch, j) => {
                                                        if (self.state.recent_view) {
                                                            return <ChartList {...self.props} template={ch} isStarredChart={(ch) => self.isStarredChart(ch)} key={j} />
                                                        } else {
                                                            if (j < 4) {
                                                                return <ChartList {...self.props} template={ch} isStarredChart={(ch) => self.isStarredChart(ch)} key={j} />
                                                            }
                                                        }
                                                    })
                                                }
                                            </div>
                                            : <div>No records in <strong>Recent Charts</strong>.</div>
                                    }

                                </div>
                            )
                        }
                    })
                }
                {/* My Charts */}
                {
                    this.props.charts.map(function (row, i) {
                        if (i == 0) {
                            return (
                                <div key={i} style={{ marginTop: 30 }}>
                                    <div>
                                        <h5 style={{ float: 'left', textAlign: 'right' }}>My Charts</h5>
                                        {
                                            row.data && row.data.length && row.data.length > 4 ?
                                                <>
                                                    {
                                                        self.state.mychart_view ?
                                                            <div style={{ float: 'right', textAlign: 'right', cursor: 'pointer' }} onClick={() => self.setState({ mychart_view: false })}>view less</div>
                                                            :
                                                            <div style={{ float: 'right', textAlign: 'right', cursor: 'pointer' }} onClick={() => self.setState({ mychart_view: true })}>view more</div>
                                                    }
                                                </>
                                                : ''
                                        }
                                        <div class="clearfix"></div>
                                    </div>
                                    {
                                        row.data && row.data.length
                                            ? <div className="row dashboard-blocks">
                                                {
                                                    row.data.filter((ch) => {
                                                        if(self?.props?.searchTerm === '') {
                                                            return ch;
                                                        } else if(ch?.chart_name?.toLowerCase().includes(self?.props?.searchTerm?.toLowerCase())) {
                                                            return ch;
                                                        }
                                                    }).map((ch, j) => {
                                                        if (self.state.mychart_view) {
                                                            return <ChartList {...self.props} template={ch} isStarredChart={(ch) => self.isStarredChart(ch)} key={j} />
                                                        } else {
                                                            if (j < 4) {
                                                                return <ChartList {...self.props} template={ch} isStarredChart={(ch) => self.isStarredChart(ch)} key={j} />
                                                            }
                                                        }
                                                    })
                                                }
                                            </div>
                                            : <div>No records in <strong>My Charts</strong>.</div>
                                    }

                                </div>
                            )
                        }
                    })
                }
                {/* Shared With Me */}
                {
                    this.props.charts.map(function (row, i) {
                        if (i == 1) {
                            return (
                                <div key={i} style={{ marginTop: 30 }}>
                                    <div>
                                        <h5 style={{ float: 'left', textAlign: 'right' }}>Shared With Me</h5>
                                        {
                                            row.data && row.data.length && row.data.length > 4 ?
                                                <>
                                                    {
                                                        self.state.shared_view ?
                                                            <div style={{ float: 'right', textAlign: 'right', cursor: 'pointer' }} onClick={() => self.setState({ shared_view: false })}>view less</div>
                                                            :
                                                            <div style={{ float: 'right', textAlign: 'right', cursor: 'pointer' }} onClick={() => self.setState({ shared_view: true })}>view more</div>
                                                    }
                                                </>
                                                : ''
                                        }
                                        <div class="clearfix"></div>
                                    </div>
                                    {
                                        row.data && row.data.length
                                            ? <div className="row dashboard-blocks">
                                                {
                                                    row.data.filter((ch) => {
                                                        if(self?.props?.searchTerm === '') {
                                                            return ch;
                                                        } else if(ch?.chart_name?.toLowerCase().includes(self?.props?.searchTerm?.toLowerCase())) {
                                                            return ch;
                                                        }
                                                    }).map((ch, j) => {
                                                        if (self.state.shared_view) {
                                                            return <ChartList {...self.props} template={ch} isStarredChart={(ch) => self.isStarredChart(ch)} key={j} />
                                                        } else {
                                                            if (j < 4) {
                                                                return <ChartList {...self.props} template={ch} isStarredChart={(ch) => self.isStarredChart(ch)} key={j} />
                                                            }
                                                        }
                                                    })
                                                }
                                            </div>
                                            : <div>No records in <strong>Shared With Me</strong>.</div>
                                    }

                                </div>
                            )
                        }
                    })
                }
                {/* Templets */}
                {
                    this.props.charts.map(function (row, i) {
                        if (i == 0) {
                            return (
                                <div key={i} style={{ marginTop: 30 }}>
                                    <div>
                                        <h5 style={{ float: 'left', textAlign: 'right' }}>Templates</h5>
                                        {
                                            row.data && row.data.filter(li => li.is_template == true).length ?
                                                <>
                                                    {
                                                        self.state.templet_view && row.data.length > 4 ?
                                                            <div style={{ float: 'right', textAlign: 'right', cursor: 'pointer' }} onClick={() => self.setState({ templet_view: false })}>view less</div>
                                                            :
                                                            <div style={{ float: 'right', textAlign: 'right', cursor: 'pointer' }} onClick={() => self.setState({ templet_view: true })}>view more</div>
                                                    }
                                                </>
                                                : ''
                                        }
                                        <div class="clearfix"></div>
                                    </div>
                                    {
                                        row.data && row.data.filter(li => li.is_template == true).length
                                            ? <div className="row dashboard-blocks">
                                                {
                                                    row.data.filter(li => li.is_template == true).filter((ch) => {
                                                        if(self?.props?.searchTerm === '') {
                                                            return ch;
                                                        } else if(ch?.chart_name?.toLowerCase().includes(self?.props?.searchTerm?.toLowerCase())) {
                                                            return ch;
                                                        }
                                                    }).map((ch, j) => {
                                                        if (self.state.templet_view) {
                                                            return <ChartList {...self.props} template={ch} isStarredChart={(ch) => self.isStarredChart(ch)} key={j} />
                                                        } else {
                                                            if (j < 4) {
                                                                return <ChartList {...self.props} template={ch} isStarredChart={(ch) => self.isStarredChart(ch)} key={j} />
                                                            }
                                                        }
                                                    })
                                                }
                                            </div>
                                            : <div>No records in <strong>Templets</strong>.</div>
                                    }

                                </div>
                            )
                        }
                    })
                }

                {/* All Charts */}
                {
                    this.props.charts.map(function (row, i) {
                        if (i == 0) {
                            return (
                                <div key={i} style={{ marginTop: 30 }}>
                                    <div>
                                        <h5 style={{ float: 'left', textAlign: 'right' }}>All Charts</h5>
                                        {
                                            row.data && row.data.length ?
                                                <>
                                                    {
                                                        self.state.allchart_view ?
                                                            <div style={{ float: 'right', textAlign: 'right', cursor: 'pointer' }} onClick={() => self.setState({ allchart_view: false })}>view less</div>
                                                            :
                                                            <div style={{ float: 'right', textAlign: 'right', cursor: 'pointer' }} onClick={() => self.setState({ allchart_view: true })}>view more</div>
                                                    }
                                                </>
                                                : ''
                                        }
                                        <div class="clearfix"></div>
                                    </div>
                                    {
                                        row.data && row.data.length
                                            ? <div className="row dashboard-blocks">
                                                {
                                                    row.data.filter((ch) => {
                                                        if(self?.props?.searchTerm === '') {
                                                            return ch;
                                                        } else if(ch?.chart_name?.toLowerCase().includes(self?.props?.searchTerm?.toLowerCase())) {
                                                            return ch;
                                                        }
                                                    })
                                                    .map((ch, j) => {
                                                        if (self.state.allchart_view) {
                                                            return <ChartList {...self.props} template={ch} isStarredChart={(ch) => self.isStarredChart(ch)} key={j} />
                                                        } else {
                                                            if (j < 4) {
                                                                return <ChartList {...self.props} template={ch} isStarredChart={(ch) => self.isStarredChart(ch)} key={j} />
                                                            }
                                                        }
                                                    })
                                                }
                                            </div>
                                            : <div>No records in <strong>All Charts</strong>.</div>
                                    }

                                </div>
                            )
                        }
                    })
                }

            </>
        );
    }
}
