import { Component } from "react";
import { SocialLoginApi } from "../../Api/auth.api";
// import FacebookLogin from "./FacebookLogin";
import GithubLogin from "./GithubLogin";
import GoogleLogin from "./GoogleLogin";

class SocialLogin extends Component {
    socialLogin = async (user) => {
        if(this.props.shareToken){user.share_token = this.props.shareToken}
        let data = await SocialLoginApi(user);
        this.props.onLoginSuccess(data);
    }
    render() {
        return (
            <div className='row text-primary mt-3'>
                <div className='col'>
                    <GoogleLogin onSuccess={(user) => this.socialLogin(user)}></GoogleLogin>
                </div>
                {/* <div className='col'>
                    <FacebookLogin onSuccess={(user) => this.socialLogin(user)}></FacebookLogin>
                </div> */}
                <div className='col'>
                    <GithubLogin onSuccess={(user) => this.socialLogin(user)}></GithubLogin>
                </div>
            </div>
        );
    }
}

export default SocialLogin;
