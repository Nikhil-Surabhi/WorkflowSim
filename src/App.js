import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import './css/style.css';
import './icomoon/style.css';
import Canvas from './Views/Canvas';
import Login from './Views/Auth/Login';
import Register from './Views/Auth/Register';
import Dashboard from './Views/Dashboard';
import { ProfileApi } from './Api/auth.api';
import Whiteboard from './Views/Whiteboard';
import Templets from './Views/Templets';
import { SvgImage } from './Views/SvgImage';
import ForgotPassword from './Views/Auth/ForgotPassword';
import ResetPassword from './Views/Auth/ResetPassword';

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={
        props => authed
          ? <Component {...props} onLogout={() => {
            console.log('logout...');
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            props.history.push('/login');
          }} />
          : <Redirect to={{ pathname: '/login', state: { 'from': props.location } }} />
      }
    />
  )
}

class App extends Component {
  state = {
    token: this.getToken(),
    user: null
  }
  getToken() {
    let localToken = localStorage.getItem('token');
    let sessionToken = sessionStorage.getItem('token');

    if (localToken) {
      return localToken;
    } else if (sessionToken) {
      return sessionToken;
    } else {
      return false;
    }
  }
  userLogout() {
    const { history } = this.props;
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    history.push('/login');
  }

  setToken = token => {
    this.setState({ token });
  }

  componentDidMount() {
    let token = this.getToken();
    if (token) {
      let response = ProfileApi();
      if (!response.status && response.data && response.data.msg === 'Unauthorized!') {
        this.userLogout();
      }
    }
  }

  render() {
    let self = this;
    let token = this.state.token;

    return (
      <BrowserRouter>
        <Switch>
          <PrivateRoute authed={token} path='/template-to-image' component={SvgImage} />
          <PrivateRoute authed={token} exact path='/' component={Dashboard}></PrivateRoute>
          <PrivateRoute authed={token} exact path='/templets' component={Templets}></PrivateRoute>
          <PrivateRoute authed={token} path='/canvas/:chartId' component={Canvas}></PrivateRoute>
          <PrivateRoute authed={token} path='/whiteboard/:whiteboardId' component={Whiteboard}></PrivateRoute>
          <Route path='/login' render={props => <Login {...props} onLogin={token => self.setToken(token)} />}></Route>
          <Route path='/register' component={Register}></Route>
          <Route path='/accept-invitation' component={Register} />
          <Route path='/forgot-password' component={ForgotPassword} />
          <Route exact path='/reset-password' component={ResetPassword} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
