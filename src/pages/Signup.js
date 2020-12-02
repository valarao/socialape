import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import { connect } from 'react-redux';
import { signupUser } from '../redux/actions/userActions';

import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { FB_FUNCTIONS_URL } from '../util/constants';
import AppIcon from '../images/icon.png';

const styles = (theme) => ({
  ...theme.common,
});

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      handle: '',
      errors: {},
    };
  }

  static getDerivedStateFromProps(nextProps, _prevState) {
    if (nextProps.ui.errors) {
      return { errors: nextProps.ui.errors };
    }

    return null;
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });

    const newUserData = {
      handle: this.state.handle,
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
    };

    this.props.signupUser(newUserData, this.props.history);

    try {
      const signupResult = await axios.post(
        `${FB_FUNCTIONS_URL}/signup`,
        newUserData,
      );
      console.log(signupResult);
      localStorage.setItem('FBIdToken', `Bearer ${signupResult.data.token}`);
      this.setState({
        loading: false,
      });

      this.props.history.push('/');
    } catch (error) {
      this.setState({
        errors: error.response.data,
        loading: false,
      });
    }
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const { classes, ui: { loading } } = this.props;
    const { errors } = this.state;

    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img src={AppIcon} alt='monkey' className={classes.image} />
          <Typography variant='h2' className={classes.pageTitle}>
            Signup
          </Typography>
          <TextField
            id='handle'
            name='handle'
            type='text'
            label='Handle'
            className={classes.textField}
            helperText={errors.handle}
            error={errors.handle ? true : false}
            value={this.state.handle}
            onChange={this.handleChange}
            fullWidth
          />
          <TextField
            id='email'
            name='email'
            type='email'
            label='Email'
            className={classes.textField}
            helperText={errors.email}
            error={errors.email ? true : false}
            value={this.state.email}
            onChange={this.handleChange}
            fullWidth
          />
          <TextField
            id='password'
            name='password'
            type='password'
            label='Password'
            className={classes.textField}
            helperText={errors.password}
            error={errors.password ? true : false}
            value={this.state.password}
            onChange={this.handleChange}
            fullWidth
          />
          <TextField
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            label='Confirm Password'
            className={classes.textField}
            helperText={errors.confirmPassword}
            error={errors.confirmPassword ? true : false}
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            fullWidth
          />
          {errors.general && (
            <Typography variant='body2' className={classes.customError}>
              {errors.general}
            </Typography>
          )}
          <Button
            type='submit'
            variant='contained'
            color='primary'
            className={classes.button}
            disabled={loading}
            onClick={this.handleSubmit}
          >
            Signup
            {loading && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
          <Typography>
            Already have an account? <Link to='/login'>Login</Link>.
          </Typography>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  ui: state.ui,
});

const mapActionsToProps = {
  signupUser,
}
export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Signup));
