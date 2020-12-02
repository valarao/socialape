import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import jwtDecode from 'jwt-decode';

import { Provider } from 'react-redux';
import store from './redux/store';

import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

import AuthRoute from './util/authRoute';
import { themeConfig } from './util/theme';

const theme = createMuiTheme(themeConfig);
let authenticated = true;

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = '/login';
    authenticated = false;
  }
} else {
  authenticated = false;
  if (
    window.location.href.indexOf('/login') === -1 &&
    window.location.href.indexOf('/signup') === -1
  ) {
    window.location.href = '/login';
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
                    authenticated={authenticated}
                  />
                  <AuthRoute
                    exact
                    path='/signup'
                    component={Signup}
                    authenticated={authenticated}
                  />
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
