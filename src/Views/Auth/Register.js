import { Component } from "react";
import { Link } from "react-router-dom";
import { RegisterApi } from "../../Api/auth.api";
import SocialLogin from "./SocialLogin";
import queryString from "query-string";
import Lottie from "react-lottie";
import logicform from "../../assets/images/register.json";
import black from "../../assets/images/logo_black.png";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: logicform,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

class Register extends Component {
  state = {
    alert: {
      type: null,
      msg: null,
    },
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    let search = this.props.location.search;

    const { history } = this.props;

    this.setState({
      alert: {
        type: "info",
        msg: "Progressing! Please wait...",
      },
    });

    var formdata = new FormData(e.target);
    let query = queryString.parse(search);
    if (query.key) formdata.append("share_token", query.key);

    var data = await RegisterApi(Object.fromEntries(formdata));

    this.setState({
      alert: {
        type: data.success ? "success" : "danger",
        msg: data.data.msg,
      },
    });

    if (data.success) history.push("/");
  };

  loginRedirect = (data) => {
    const { history } = this.props;
    localStorage.setItem("token", data.accessToken);

    this.setState({
      alert: {
        type: "success",
        msg: data.msg,
      },
    });
    history.push("/");
  };

  render() {
    let alertBox = null,
      disabled = false;
    let search = this.props.location.search;
    let query = queryString.parse(search);

    if (this.state.alert.type) {
      alertBox = (
        <div className={`alert alert-${this.state.alert.type}`}>
          {this.state.alert.msg}
        </div>
      );
    }
    if (this.state.alert.type === "info") {
      disabled = "disabled";
    }
    return (
      <div className="vh-100 bg-primary d-flex align-items-center justify-content-center">
        <div
          style={{
            alignItems: "center",
            paddingLeft: "15%",
          }}
          className="row text-primary mt-3"
        >
          <div className="col">
            <Lottie
              style={{
                paddingRight: 200,
                paddingTop: 80,
              }}
              options={defaultOptions}
              height={600}
              width={700}
            />
          </div>
        </div>
        <div
          className="row text-primary mt-3"
          style={{ alignItems: "center", paddingLeft: "15%" }}
        >
          <div className="col">
            <img
              src={black}
              style={{
                width: "40%",
                paddingBottom: 20,
                paddingLeft: 100,
              }}
            ></img>
            <div className="card" style={{ width: 400 }}>
              <div className="card-body">
                <form
                  method="post"
                  autoComplete="off"
                  onSubmit={this.handleSubmit}
                >
                  {alertBox}
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Enter Name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter Email Address"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter Password"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      name="connfirmpassword"
                      className="form-control"
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={disabled}
                  >
                    Register
                  </button>
                  <div className="text-center mt-1">
                    Already have an account? <Link to="/login">Login here</Link>
                    .
                  </div>
                  <hr />
                  <div className="text-center">
                    <h5>Register with</h5>
                    <SocialLogin
                      onLoginSuccess={(data) => this.loginRedirect(data)}
                      shareToken={query.key}
                    ></SocialLogin>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
