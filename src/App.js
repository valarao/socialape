import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
// import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core';

import jwtDecode from 'jwt-decode';

import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';

import './App.css';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import User from './pages/User';

import AuthRoute from './util/authRoute';
import { themeConfig } from './util/theme';
import axios from 'axios';

const theme = createMuiTheme(themeConfig);

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = '/login';
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <div className='App'>
            <Router>
              <Navbar />
              <div className='container'>
                <Switch>
                  <Route exact path='/' component={Home} />
                  <AuthRoute
                    exact
                    path='/login'
                    component={Login}
                  />
                  <AuthRoute
                    exact
                    path='/signup'
                    component={Signup}
                  />
                  <Route exact path='/users/:handle' component={User} />
                  <Route exact path='/users/:handle/scream/:screamId' component={User} />
                </Switch>
              </div>
            </Router>
          </div>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
