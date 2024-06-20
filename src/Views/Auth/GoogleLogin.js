import { Component } from "react";

class GoogleLogin extends Component {
    state = {
        clientId: '125942560180-2r0gk1hdm64509oer3k42gssj29nelhs.apps.googleusercontent.com',
        clientSecret: '2Y_mrzSCkghmhMEOd_BwBmbM'
    }
    componentDidMount() {
        window['googleSDKLoaded'] = () => {
            window['gapi'].load('auth2', () => {
                this.auth2 = window['gapi'].auth2.init({
                    client_id: this.state.clientId,
                    cookiepolicy: 'single_host_origin',
                    scope: 'profile email'
                });
                this.prepareLoginButton();
            });
        }

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'google-jssdk'));
    }
    prepareLoginButton = () => {
        let self = this;
        this.auth2.attachClickHandler(this.refs.googleLoginBtn, {},
            (googleUser) => {

                let profile = googleUser.getBasicProfile();
                // console.log('Token || ' + googleUser.getAuthResponse().id_token);
                // console.log('ID: ' + profile.getId());
                // console.log('Name: ' + profile.getName());
                // console.log('Image URL: ' + profile.getImageUrl());
                // console.log('Email: ' + profile.getEmail());
                //YOUR CODE HERE

                let user = {
                    id: profile.getId(),
                    name: profile.getName(),
                    image: profile.getImageUrl(),
                    email: profile.getEmail(),
                    type: 'google'
                }

                self.props.onSuccess(user);

            }, (error) => {
                alert(JSON.stringify(error, undefined, 2));
            });

    }
    render() {
        return (
            <button type='button' className='btn btn-block btn-outline-danger' ref='googleLoginBtn'>
                <i className='icon-google'></i><br />Google
            </button>
        );
    }
}

export default GoogleLogin;
