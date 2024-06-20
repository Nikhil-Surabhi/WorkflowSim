import { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { resetPasswordLinkApi } from "../../Api/auth.api"; // "../../Api/auth.api";
import Lottie from "react-lottie";
import logicform from "../../assets/images/forgotpassword.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: logicform,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
class ForgotPassword extends Component {
  state = {
    data: null,
    showModal: false,
    result: false,
    alert: {
      msg: null,
      type: null,
    },
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    this.setState({
      alert: {
        type: "info",
        msg: "Progressing, Please wait...",
      },
    });

    var formdata = new FormData(e.target);
    var data = await resetPasswordLinkApi(Object.fromEntries(formdata));
    if (data.success) {
      this.setState({ data: data.data.msg });
      this.setState({ result: true });
    } else {
      this.setState({ data });
      this.setState({
        showModal: true,
        alert: {
          type: "danger",
          msg: data.data,
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
      <>
        {!this.state.result ? (
          <>
            <Modal
              show={this.state.showModal}
              onHide={() => this.setState({ showModal: false })}
            >
              <Modal.Header closeButton>
                <Modal.Body style={{ fontWeight: "550" }}>
                  {this.state?.data?.data}. You can either re-enter the correct
                  id or register as a new user
                </Modal.Body>
              </Modal.Header>
              <Modal.Footer>
                <Button
                  variant="dark"
                  onClick={() => this.setState({ showModal: false })}
                >
                  Try Again
                </Button>
                <Button variant="primary">
                  <Link
                    style={{ textDecoration: "none", color: "#fff" }}
                    to="/register"
                  >
                    Register
                  </Link>
                </Button>
              </Modal.Footer>
            </Modal>
            <div
              className="vh-100 d-flex align-items-center justify-content-center"
              style={{ backgroundColor: "#222" }}
            >
              <div className="col">
                <div
                  style={{ width: 850 }}
                  className="d-flex align-items-center justify-content-center"
                >
                  <Lottie
                    style={{
                      paddingLeft: 150,
                    }}
                    options={defaultOptions}
                    height={400}
                    width={580}
                  />
                </div>
              </div>
              <div
                className="col"
                style={{ alignItems: "center", paddingLeft: "20%" }}
              >
                <div
                  style={{ width: 400 }}
                  className="d-flex align-items-center justify-content-center"
                >
                  <img
                    src={"/logo.png"}
                    alt="logo"
                    style={{ width: "50%", paddingBottom: 40 }}
                  ></img>
                </div>
                <div className="card" style={{ width: 400 }}>
                  <div className="card-body">
                    <form
                      method="post"
                      autoComplete="off"
                      onSubmit={this.handleSubmit}
                    >
                      {alertBox}
                      <div className="mt-1 mb-3">
                        <p style={{ fontSize: "13px", fontWeight: 600 }}>
                          Enter the email assosciated with your account and
                          we'll send you a link to reset your password.
                        </p>
                      </div>
                      <div className="form-group">
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Enter Email Address"
                          autoComplete="off"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn  btn-block"
                        disabled={disabled}
                        style={{ backgroundColor: "#222", color: "#fff" }}
                      >
                        Continue
                      </button>
                      <div className="text-center mt-1">
                        Don't have account?{" "}
                        <Link to="/register">Register here</Link>.
                      </div>
                      <hr />
                      {/* <div className='text-center'>
                                    <h5>Continue with</h5>
                                    <SocialLogin onLoginSuccess={(data) => this.loginRedirect(data)}></SocialLogin>
                                </div> */}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div
            className="vh-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#222" }}
          >
            <div>
              <div
                style={{ width: 400 }}
                className="d-flex align-items-center justify-content-center"
              >
                <img
                  src={"/logo.png"}
                  alt="logo"
                  style={{ width: "50%", paddingBottom: 50 }}
                ></img>
              </div>
              <div className="card" style={{ width: 400 }}>
                <div
                  className="card-body"
                  style={{ textAlign: "center", fontWeight: "600" }}
                >
                  {this.state?.data}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default ForgotPassword;
