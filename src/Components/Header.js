import React, { Component } from "react";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";

export default class Header extends Component {
    render() {
        let userString = localStorage.getItem('user');
        let user = JSON.parse(userString);

        return (
            <header>
                <div className="container-fluid">
                    <div className="header-bar">
                        <Link to='/'>
                            <img src={'/logo.png'} alt="logo" style={{ width: "110px", height: '55px', cursor: "pointer" }}></img>
                        </Link>
                        <div className="ml-auto d-flex">
                            <input className="form-control" type='text' value={this.props.inputText} onChange={this.props.getSearchResults} placeholder="SEARCH DOCUMENT" />
                            <div class="dropdown ml-2" style={{ width: 70 }}>
                                <div data-toggle="dropdown" style={{ cursor: "pointer" }} className="dropdown-toggle rounded-circle">
                                    {/* <ConfigProvider colors={['red', 'green', 'blue']}> */}
                                    <Avatar name={user ? user.name : ''} size={36} className=" rounded-circle" />
                                    {/* </ConfigProvider> */}
                                </div>
                                {/* <img src={'/profile.jpg'} alt="profile" data-toggle="dropdown" style={{ width: "36px", cursor: "pointer" }} className="dropdown-toggle rounded-circle" /> */}
                                <ul class="dropdown-menu dropdown-menu-right">
                                    <li>
                                        <div className="dropdown-item text-primary">
                                            Hi, {user ? user.name : ''}<br />
                                            <small>({user ? user.email : ''})</small>
                                        </div>
                                    </li>
                                    <li><Link className="dropdown-item" to="#">Account Setting</Link></li>
                                    <li>
                                        <button className="dropdown-item" style={{ cursor: "pointer" }} onClick={() => this.props.onLogout()}>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}
