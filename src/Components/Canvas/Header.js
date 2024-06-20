import React, { Component, useEffect, useState } from "react";
import { Link, Redirect } from 'react-router-dom';
import { addUpdateChartAccess, getChartAccess } from "../../Api/chart.api";
import swal from "sweetalert";
import Avatar from 'react-avatar';
import { Modal, Button } from 'react-bootstrap';

function CanvasHeader({ chartName, chart, updateChartName, handleFocus, saveTemplate, nodes, saveStatus }) {

    // Getting User Data
    let userString = localStorage.getItem('user');
    let user = JSON.parse(userString);

    // initializing states using useState Hooks and altering them later
    const [email, setEmail] = useState(null);
    const [accessType, setAccessType] = useState(null);
    const [chartAccess, setChartAccess] = useState(null);
    const [shareModal, setShareModal] = useState(false);

    // Logout Function
    const onLogout = () => {
        console.log('logout...');
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        <Redirect to="/login" />
    }

    // exporting the flowchart as JSON from the file menu
    const exportJson = () => {
        handleFocus();
        let fname = chartName;
        fname = fname.replace(" ", "_");
        console.log('fname', fname);
        let filename;
        if (fname != '') {
            filename = fname + ".wfs";
        } else {
            filename = "workflowsim.wfs";
        }
        let text = JSON.stringify(nodes, null, 2);

        var element = document.createElement("a");
        element.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," + encodeURIComponent(text)
        );
        element.setAttribute("download", filename);

        element.style.display = "none";
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    // Exporting Flowchart as an image
    const exportImage = () => {
        handleFocus();
        setTimeout(() => {

            let fname = chartName;
            fname = fname.replace(" ", "_");
            console.log('fname', fname);
            let filename;
            if (fname != '') {
                filename = fname + ".png";
            } else {
                filename = "workflowsim.png";
            }

            var svg = document.querySelector("#chart svg");
            var xml = new XMLSerializer().serializeToString(svg);

            const svgString2Image = (xml, 800, 600, "png", (image64) => {
                var element = document.createElement("a");
                element.setAttribute("href", image64);
                element.setAttribute("download", filename);

                element.style.display = "none";
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
            });
        }, 10);

    }

    // Integration of chart access api 
    const accessChart = async e => {
        e.preventDefault();
        var data = {
            "email": email,
            "chart_id": chart.chart_id,
            "access_type": accessType,
            "is_active": true,
            "chart_access_id": null
        }
        let response = await addUpdateChartAccess(data);
        setEmail('');
        setAccessType('');

        getChartA();
        if (response.success) {
            swal("Success!", "You've successfully shared your chart.", "success");
        } else {
            swal("Warning!", "Some propblems occurs.", "warning");
        }
    }

    const changeAccess = async (e, index) => {
        chartAccess.shared_users[index].access_type = e.target.value;

        setChartAccess(chartAccess);

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

    const getChartA = async () => {
        let response = await getChartAccess(chart.chart_id);
        setChartAccess(response.data)
        console.log('access response: ', response);
    }

    const closeSharePopup = () => {
        document.querySelector('.share-popup-container').classList.remove('active');
    }

    // useEffect Hook called for calling the access details api
    useEffect(() => {

        getChartA()
    }, [])

    return (
        <div className="canvas-header">
            <Link to="/" className="file-icon">
                <i className="icon-folder"></i>
            </Link>
            <div>
                <input type="text" value={chartName} className="canvas-title" onInput={(e) => updateChartName(e.target.value)} onClick={handleFocus} />
                <ul className="menu">
                    <li className="dropdown">
                        <Link to="#" data-toggle="dropdown">File</Link>
                        <div className="dropdown-menu">
                            {/* <Link className="dropdown-item" to="#">Import</Link> */}
                            <button className="dropdown-item" onClick={saveTemplate}>Save As Template</button>
                            <button className="dropdown-item" onClick={exportJson}>Export</button>
                            <button className="dropdown-item" onClick={exportImage}>Download Image</button>
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
                            saveStatus ?
                                <Link to="#"><i className="icon-clock"></i> Saving...</Link>
                                :
                                <Link to="#"><i className="icon-clock"></i> Saved</Link>
                        }
                    </li>
                </ul>
            </div>
            <div className="ml-auto d-flex align-items-center">
                <div className="flex-end mr-2">
                    <button className="btn btn-primary share-btn" type="button" onClick={() => setShareModal(true)}><i className="icon-users2"></i> Share</button>
                </div>
                <div className="flex-end">
                    <div className="dropdown">

                        <div data-toggle="dropdown" style={{ cursor: "pointer" }} className="dropdown-toggle rounded-circle">
                            {/* <ConfigProvider colors={['red', 'green', 'blue']}> */}
                            <Avatar name={user ? user.name : ''} size={36} className=" rounded-circle" />
                            {/* </ConfigProvider> */}
                        </div>
                        {/* <img
                                src={'/profile.jpg'}
                                data-toggle="dropdown"
                                style={{ width: "36px", cursor: "pointer" }}
                                alt="profile image"
                                className="dropdown-toggle rounded-circle"
                            /> */}
                        <ul className="dropdown-menu dropdown-menu-right">
                            <li>
                                <div className="dropdown-item text-primary">
                                    Hi, {user ? user.name : ''}<br />
                                    <small>({user ? user.email : ''})</small>
                                </div>
                            </li>
                            <li><Link className="dropdown-item" to="#">Account Settings</Link></li>
                            <li><a className="dropdown-item" style={{ cursor: "pointer" }} onClick={onLogout}>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="share-popup-container">
                <div className="share-popup-bg"></div>
                <div className="share-popup">
                    <div className="card">
                        {/* <div className="card-header">
                            <button className="close close-btn" title="Close">&times;</button>
                            Share
                        </div> */}
                        <div className="card-body">

                            {
                                shareModal && (
                                    <Modal show={shareModal} onHide={() => setShareModal(false)} centered>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Share</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <form action="" method="post" className="d-flex form-group" onSubmit={accessChart}>
                                                <div className="">
                                                    <div style={{ width: '330px'}} className="d-flex input-custom-group">
                                                        <input type="email" name="email" className="form-control" placeholder="Enter email address" value={email} autoComplete="off" onInput={(e) => setEmail(e.target.value)} />
                                                        <select value={accessType} onInput={(e) => setAccessType(e.target.value)}>
                                                            <option value="VIEW">can view</option>
                                                            <option value="EDIT">can edit</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div style={{ width: '95px'}}  className="ml-2">
                                                    <button type="submit" className="btn btn-block btn-primary">Share</button>
                                                </div>
                                            </form>
                                            {
                                                chartAccess
                                                    ? <ul className="shared-users">
                                                        <li className="heading">
                                                            Shared Users
                                                        </li>
                                                        <li>
                                                            <div className="flex-fill">
                                                                <div>{chartAccess.created_user.name}</div>
                                                                <div>{chartAccess.created_user.email}</div>
                                                            </div>
                                                            <div>
                                                                ADMIN
                                                            </div>
                                                        </li>
                                                        {
                                                            chartAccess.shared_users
                                                            && chartAccess.shared_users.length
                                                            && chartAccess.shared_users.map((row, index) => {
                                                                return (
                                                                    <li key={index}>
                                                                        <div className="flex-fill">
                                                                            <div>{row.name}</div>
                                                                            <div>{row.email}</div>
                                                                        </div>
                                                                        <div>
                                                                            <select value={row.access_type} onInput={e => changeAccess(e, index)}>
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
                                        </Modal.Body>
                                    </Modal>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CanvasHeader