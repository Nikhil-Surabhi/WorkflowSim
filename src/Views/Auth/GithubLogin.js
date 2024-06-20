import axios from "axios";
import { Component } from "react";

class GithubLogin extends Component {
    state = {
        clientId: '5bfa604ec6a4efcf3cc7',
        clientSecret: '190f8974545b8c83526f6d0ecd27e6a783297bf3',
        redirectUrl: 'https://localhost:3000/login',
        token: null
    }
    componentDidMount() {
        const code =
            window.location.href.match(/\?code=(.*)/) &&
            window.location.href.match(/\?code=(.*)/)[1];

        if (code) {
            const { clientId, clientSecret } = this.state;
            const body = {
                client_id: clientId,
                client_secret: clientSecret,
                code: code
            };
            const opts = { headers: { accept: 'application/json' } };
            axios.post('/oauth/access_token', body, opts)
                .then(res => res.data['access_token'])
                .then(_token => {
                    this.setState({ token: _token })
                    this.getInfo();
                });
        }
    }
    getInfo = () => {
        let self = this;
        const { token } = this.state;

        let opts = {
            headers: {
                accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }

        axios.get('https://api.github.com/user', opts)
            .then(res => res.data)
            .then(response => {
                let user = {
                    id: response.id,
                    name: response.name,
                    image: response.avatar_url,
                    email: null,
                    type: 'github'
                }

                self.props.onSuccess(user);
            });
    }
    render() {
        const { clientId, redirectUrl } = this.state;
        return (
            <a href={`https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user&redirect_uri=${redirectUrl}`} className='btn btn-block btn-outline-dark'>
                <i className='icon-github'></i><br />Github
            </a>
        );
    }
}

export default GithubLogin;
