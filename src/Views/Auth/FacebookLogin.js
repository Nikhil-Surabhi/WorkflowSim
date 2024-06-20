import { Component } from "react";

class FacebookLogin extends Component {
    componentDidMount() {
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: '541111483550956',
                cookie: true,  // enable cookies to allow the server to access
                // the session
                xfbml: true,  // parse social plugins on this page
                version: 'v10.0' // use version 2.1
            });
            // window.FB.getLoginStatus(function (response) {
            //     this.statusChangeCallback(response);
            // }.bind(this));
        };

        // Load the SDK asynchronously
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    // Here we run a very simple test of the Graph API after login is
    // successful.  See statusChangeCallback() for when this call is made.
    getInfo = function () {
        let self = this;
        window.FB.api('/me?fields=id,name,email,picture', function (response) {
            // console.log(response);
            let user = {
                id: response.id,
                name: response.name,
                image: response.picture.data.url,
                email: response.email,
                type: 'facebook'
            }
            self.props.onSuccess(user);
        });
    }

    // This is called with the results from from FB.getLoginStatus().
    statusChangeCallback = (response) => {
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            this.getInfo();
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            // document.getElementById('status').innerHTML = 'Please log ' +
            //     'into this app.';
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            // document.getElementById('status').innerHTML = 'Please log ' +
            //     'into Facebook.';
        }
    }

    checkLoginState() {
        window.FB.getLoginStatus(function (response) {
            this.statusChangeCallback(response);
        }.bind(this));
    }
    FacebookLogin = () => {
        window.FB.login(this.checkLoginState(), { scope: 'email' });
    }
    render() {
        return (
            <button type='button' className='btn btn-block btn-outline-primary' onClick={this.FacebookLogin}>
                <i className='icon-facebook'></i><br />Facebook
            </button>
        );
    }
}

export default FacebookLogin;
