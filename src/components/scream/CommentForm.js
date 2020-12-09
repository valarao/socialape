import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import { connect } from 'react-redux';
import { submitComment, clearErrors } from '../../redux/actions/dataActions';

const styles = (theme) => ({
  ...theme.common,
});

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: '',
      errors: {},
    };
  }

  static getDerivedStateFromProps(nextProps, _prevState) {
    if (nextProps.ui.errors) {
      return { errors: nextProps.ui.errors };
    }

    return { errors: {} };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    await this.props.submitComment(this.props.screamId, { body: this.state.body });
    if (Object.entries(this.state.errors).length === 0) {
      this.setState({ body: '' });
    }
  }

  render() {
    const { classes, authenticated } = this.props;
    const { errors } = this.state;
    
    return authenticated ? (
      <Grid item sm={12} style={{ textAlign: 'center' }}>
          <TextField
            name='body'
            type='text'
            label='Comment on scream'
            error={errors.comment ? true : false}
            helperText={errors.comment}
            value={this.state.body}
            onChange={this.handleChange}
            fullWidth
            className={classes.textField}
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            onClick={this.handleSubmit}
            className={classes.button}
          >
            Submit
          </Button>
        <hr className={classes.visibleSeparator} />
      </Grid>
    ) : null;
  }
}

CommentForm.propTypes = {
  submitComment: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  ui: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  ui: state.ui,
  authenticated: state.user.authenticated,
});

const mapActionsToProps = {
  submitComment,
  clearErrors,
};

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(withStyles(styles)(CommentForm));
