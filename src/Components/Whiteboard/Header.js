import { Component } from "react";
import { Link } from "react-router-dom";
import { addUpdateChartAccess, getChartAccess } from "../../Api/chart.api";

export default class WhiteboardHeader extends Component {
    state = {
        share: {
            email: '',
            access_type: ''
        },
        chartAccess: null
    }
    updateChartName = whiteboard_name => {
        let { chart } = this.props.state
        chart.chart_name = whiteboard_name
        this.props.updateState({
            chart
        });
    }
    getChartAccess = async () => {
        let { chart } = this.props.state;
        let response = await getChartAccess(chart.chart_id);
        this.setState({
            chartAccess: response.data
        });
    }
    handleInput = (e, type) => {
        let share = this.state.share;
        share[type] = e.target.value;

        this.setState({ share });
    }
    changeAccess = async (e, index) => {
        let chartAccess = this.state.chartAccess;
        chartAccess.shared_users[index].access_type = e.target.value;

        this.setState({ chartAccess });

        var data = {
            "email": chartAccess.shared_users[index].email,
            "chart_id": chartAccess.shared_users[index].chart_id,
            "access_type": e.target.value,
            "is_active": true,
            "chart_access_id": chartAccess.shared_users[index].chart_access_id
        }
        let response = await addUpdateChartAccess(data);

        console.log('edited access: ', response);
    }
    accessChart = async e => {
        e.preventDefault();
        var { email, access_type } = this.state.share
        let { chart } = this.props.state;
        var data = {
            "email": email,
            "chart_id": chart.chart_id,
            "access_type": access_type,
            "is_active": true,
            "chart_access_id": null
        }
        let response = await addUpdateChartAccess(data);

        this.getChartAccess();

        console.log(response);
    }
    closeSharePopup() {
        document.querySelector('.share-popup-container').classList.remove('active');
    }
    componentDidMount() {
        document.querySelector('.share-btn')
            .addEventListener("click", function (e) {
                e.preventDefault();
                document.querySelector('.share-popup-container').classList.add('active');
            });

        document.querySelector('.share-popup-container .close-btn')
            .addEventListener("click", e => {
                console.log('closing popup');
                e.preventDefault();
                this.closeSharePopup()
            })

        document.querySelector('.share-popup-container .share-popup-bg')
            .addEventListener("click", e => {
                console.log('closing popup');
                e.preventDefault();
                this.closeSharePopup()
            })

        this.getChartAccess()
    }
    render() {
        let { email, access_type } = this.state.share

        let { state } = this.props;
        let userString = localStorage.getItem('user');
        let user = JSON.parse(userString);
        return (
            <div className="canvas-header">
                <Link to="/" className="file-icon">
                    <i className="icon-folder"></i>
                </Link>
                <div>
                    <input type="text" value={state.chart.chart_name} className="canvas-title" onInput={e => this.updateChartName(e.target.value)} onClick={() => true // this.props.setStateValue({focused: null})
                    } />
                    <ul className="menu">
                        <li className="dropdown">
                            <Link to="#" data-toggle="dropdown">File</Link>
                            <div className="dropdown-menu">
                                <Link className="dropdown-item" to="#">Import</Link>
                                <a className="dropdown-item" href="javascript:" onClick={() => this.exportJson()}>Export</a>
                                <button className="dropdown-item" onClick={() => this.exportImage()}>Download Image</button>
                            </div>
                        </li>
                        <li>
                            <Link to="#">Edit</Link>
                        </li>
                        <li>
                            <Link to="#">Select</Link>
                        </li>
                        <li>
                            <Link to="#">View</Link>
                        </li>
                        <li>
                            <Link to="#">Insert</Link>
                        </li>
                        <li>
                            <Link to="#">Arrange</Link>
                        </li>
                        <li>
                            <Link to="#">Help</Link>
                        </li>
                        <li>
                            {
                                this.props.state.save_status ?
                                    <Link to="#"><i className="icon-clock"></i> Saving...</Link>
                                    :
                                    <Link to="#"><i className="icon-clock"></i> Saved</Link>
                            }
                        </li>
                    </ul>
                </div>
                <div className="ml-auto d-flex align-items-center">
                    <div className="flex-end mr-2">
                        <button className="btn btn-primary share-btn" type="button"><i className="icon-users2"></i> Share</button>
                    </div>
                    <div className="flex-end">
                        <div className="dropdown">
                            <img
                                src={'/profile.jpg'}
                                data-toggle="dropdown"
                                style={{ width: "36px", cursor: "pointer" }}
                                alt="profile image"
                                className="dropdown-toggle rounded-circle"
                            />
                            <ul className="dropdown-menu dropdown-menu-right">
                                <li>
                                    <div className="dropdown-item text-primary">
                                        Hi, {user ? user.name : ''}<br />
                                        <small>({user ? user.email : ''})</small>
                                    </div>
                                </li>
                                <li><Link className="dropdown-item" to="#">Account Setting</Link></li>
                                <li><a className="dropdown-item" style={{ cursor: "pointer" }} onClick={() => this.props.onLogout()}>Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="share-popup-container">
                    <div className="share-popup-bg"></div>
                    <div className="share-popup">
                        <div className="card">
                            <div className="card-header">
                                <button className="close close-btn" title="Close">&times;</button>
                                Share
                            </div>
                            <div className="card-body">
                                <form action="" method="post" className="d-flex form-group" onSubmit={this.accessChart}>
                                    <div className="">
                                        <div className="d-flex input-custom-group">
                                            <input type="email" name="email" className="form-control" placeholder="Enter email address" value={email} autoComplete="off" onInput={e => this.handleInput(e, 'email')} />
                                            <select value={access_type} onInput={e => this.handleInput(e, 'access_type')}>
                                                <option value="VIEW">can view</option>
                                                <option value="EDIT">can edit</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="ml-2">
                                        <button type="submit" className="btn btn-block btn-primary">Share</button>
                                    </div>
                                </form>
                                {
                                    this.state.chartAccess
                                        ? <ul className="shared-users">
                                            <li className="heading">
                                                Shared Users
                                            </li>
                                            <li>
                                                <div className="flex-fill">
                                                    <div>{this.state.chartAccess.created_user.name}</div>
                                                    <div>{this.state.chartAccess.created_user.email}</div>
                                                </div>
                                                <div>
                                                    ADMIN
                                                </div>
                                            </li>
                                            {
                                                this.state.chartAccess.shared_users
                                                && this.state.chartAccess.shared_users.length
                                                && this.state.chartAccess.shared_users.map((row, index) => {
                                                    return (
                                                        <li key={index}>
                                                            <div className="flex-fill">
                                                                <div>{row.name}</div>
                                                                <div>{row.email}</div>
                                                            </div>
                                                            <div>
                                                                <select value={row.access_type} onInput={e => this.changeAccess(e, index)}>
                                                                    <option value="VIEW">can view</option>
                                                                    <option value="EDIT">can edit</option>
                                                                </select>
                                                            </div>
                                                        </li>
                                                    );
                                                })
                                            }
                                        </ul>
                                        : <></>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}