import { Component } from "react";
import { Link } from "react-router-dom";
import { changePassword, getResetPasswordToken } from "../../Api/auth.api";
import reset_password from "../../assets/images/reset_password.json";
import Lottie from "react-lottie";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: reset_password,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
class ResetPassword extends Component {
  state = {
    key: null,
    password: null,
    confirmpassword: null,
    passwordnotMatch: false,
    passwordMatch: false,
    alert: {
      msg: null,
      type: null,
    },
  };

  componentDidMount = async () => {
    let key = this.getToken();
    getResetPasswordToken(key);
  };
  getToken = async () => {
    let queryParams = new URLSearchParams(window.location.search);
    const key = queryParams.get("key");
    this.setState({ key });
    return key;
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    this.setState({
      alert: {
        type: "info",
        msg: "Progressing, Please wait...",
      },
    });

    let postData = {
      token: this.state.key,
      password: this.state.password,
      confirmpassword: this.state.confirmpassword,
    };

    let data = await changePassword(postData);

    if (data.success) {
      this.setState({ result: true });
      this.setState({
        alert: {
          type: "info",
          msg: "Password Changed Successfully",
        },
      });
      this.props.history.push(`/login`);
    } else {
      this.setState({ data: data.data });
      this.setState({
        showModal: true,
        alert: {
          type: "danger",
          msg: "There is some issue, pls try again later..",
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
        </div>
        <div
          className="col"
          style={{
            alignItems: "center",
            paddingLeft: "25%",
          }}
        >
          <img
            src={"/logo.png"}
            alt="logo"
            style={{ width: "45%", paddingBottom: 40, paddingLeft: 100 }}
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
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter Password"
                    value={this.state.password}
                    onChange={(e) =>
                      this.setState({ password: e.target.value })
                    }
                    autoComplete="new-password"
                    required
                  />
                  <input
                    style={{ marginTop: 15 }}
                    type="password"
                    name="confirmpassword"
                    className="form-control"
                    placeholder="Enter Confirm Password"
                    value={this.state.confirmpassword}
                    onChange={(e) => {
                      this.setState({ confirmpassword: e.target.value });
                      if (this.state.password !== e.target.value) {
                        this.setState({ passwordnotMatch: true });
                      } else {
                        this.setState({
                          passwordnotMatch: false,
                          passwordMatch: true,
                        });
                      }
                    }}
                    autoComplete="new-password"
                    required
                  />
                  {this.state.passwordMatch ? (
                    <Lottie
                      style={{ marginTop: -50, marginLeft: 300 }}
                      options={defaultOptions}
                      height={60}
                      width={60}
                    />
                  ) : null}
                </div>
                {this.state.passwordnotMatch ? (
                  <text
                    style={{
                      color: "red",
                      marginLeft: 3,
                    }}
                  >
                    Password doesn't match.
                  </text>
                ) : null}
                <button
                  type="submit"
                  className="btn  btn-block"
                  disabled={disabled}
                  style={{
                    backgroundColor: "#222",
                    color: "#fff",
                    marginTop: 10,
                  }}
                >
                  Change Password
                </button>
                <div className="text-center mt-1">
                  New to Workflowsim? <Link to="/register">Register here</Link>.
                </div>
                <hr />
                {/* <div className='text-center'>
                                    <h5>Login with</h5>
                                    <SocialLogin onLoginSuccess={(data) => this.loginRedirect(data)}></SocialLogin>
                                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResetPassword;
