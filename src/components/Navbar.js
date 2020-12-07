import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';

import TooltipButton from './TooltipButton';

class Navbar extends Component {
  render() {
    const { authenticated } = this.props;
    return (
      <AppBar>
        <Toolbar className='nav-container'>
          {authenticated ? (
            <>
              <TooltipButton tipTitle='Post a scream!'>
                <AddIcon />
              </TooltipButton>
              <Link to='/'>
                <TooltipButton tipTitle='Home'>
                  <HomeIcon />
                </TooltipButton>
              </Link>
              <TooltipButton tipTitle='Notifications'>
                <NotificationsIcon />
              </TooltipButton>
            </>
          ) : (
            <>
              <Button color='inherit' component={Link} to='/login'>
                Login
              </Button>
              <Button color='inherit' component={Link} to='/'>
                Home
              </Button>
              <Button color='inherit' component={Link} to='/signup'>
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(Navbar);
