import { Component } from "react";
import { Link } from "react-router-dom";
import { LoginApi } from "../../Api/auth.api"; // "../../Api/auth.api";
import SocialLogin from "./SocialLogin";
import Lottie from "react-lottie";
import logicform from "../../assets/images/logicform.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: logicform,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
class Login extends Component {
  state = {
    alert: {
      msg: null,
      type: null,
    },
  };

  handleSubmit = async (e) => {
    // this.props.history.push("/reset-password");
    e.preventDefault();

    this.setState({
      alert: {
        type: "info",
        msg: "Progressing, Please wait...",
      },
    });

    var formdata = new FormData(e.target);
    var data = await LoginApi(Object.fromEntries(formdata));

    if (data.success) {
      let remember_me = document.getElementById("rememberMe").checked;
      this.setState({
        alert: {
          type: "success",
          msg: data.data.msg,
        },
      });
      this.loginRedirect(data, remember_me);
    } else {
      this.setState({
        alert: {
          type: "danger",
          msg: data.data.msg,
        },
      });
    }
  };

  loginRedirect = (data, remember_me = true) => {
    const { history } = this.props;

    if (data.data.accessToken && typeof data.data.accessToken !== "undefined") {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      if (remember_me) {
        localStorage.setItem("token", data.data.accessToken);
      } else {
        sessionStorage.setItem("token", data.data.accessToken);
      }

      localStorage.setItem("user", JSON.stringify(data.data.data));

      this.setState({
        alert: {
          type: "success",
          msg: data.data.msg,
        },
      });

      this.props.onLogin(data.data.accessToken);

      history.push("/");
    } else {
      this.setState({
        alert: {
          type: "danger",
          msg: "something went wrong, try again.",
        },
      });
    }
  };

  render() {
    let alertBox = null,
      disabled = false;
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
      <div
        className="vh-100 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: "#222" }}
      >
        <div className="row text-primary mt-3">
          <div className="col" style={{}}>
            <div
              style={{ width: 850 }}
              className="d-flex align-items-center justify-content-center"
            >
              <Lottie
                style={{
                  paddingLeft: "35%",
                }}
                options={defaultOptions}
                height={500}
                width={1400}
              />
            </div>
          </div>
          <div
            className="col"
            style={{
              alignItems: "center",
              paddingLeft: "20%",
            }}
          >
            <img
              src={"/logo.png"}
              alt="logo"
              style={{ width: "40%", paddingBottom: 20, paddingLeft: 100 }}
            ></img>
            <div
              className="card"
              style={{
                width: 400,
              }}
            >
              <div className="card-body">
                <form
                  method="post"
                  autoComplete="off"
                  onSubmit={this.handleSubmit}
                >
                  {alertBox}
                  <div className="form-group">
                    <input
                      type="email"
                      name="login"
                      className="form-control"
                      placeholder="Enter Email Address"
                      autoComplete="off"
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
                  <div className="form-group d-flex">
                    <label>
                      <input
                        type="checkbox"
                        name="remember_me"
                        value="1"
                        className="mr-1"
                        id="rememberMe"
                      />
                      Remember Me?
                    </label>
                    <Link to="/forgot-password" className="ml-auto">
                      Forgot Password?
                    </Link>
                  </div>
                  <button
                    type="submit"
                    className="btn  btn-block"
                    disabled={disabled}
                    style={{ backgroundColor: "#222", color: "#fff" }}
                  >
                    Login
                  </button>
                  <div className="text-center mt-1">
                    Doesn't have account?{" "}
                    <Link to="/register">Register here</Link>.
                  </div>
                  <hr />
                  <div className="text-center">
                    <h5>Login with</h5>
                    <SocialLogin
                      onLoginSuccess={(data) => this.loginRedirect(data)}
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

export default Login;
