import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

import { postScream, clearErrors } from '../../redux/actions/dataActions';
import TooltipButton from '../common/TooltipButton';

const styles = (theme) => ({
  ...theme.common,
  submitButton: {
    position: 'relative',
    float: 'right',
    marginTop: 10,
    marginBottom: 20,

  },
  progressSpinner: {
    position: 'absolute',
  },
  closeButton: {
    position: 'absolute',
    left: '90%',
    top: '5%',
  },
});

class PostScream extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      body: '',
      errors: {},
    };
  }

  static getDerivedStateFromProps(nextProps, _prevState) {
    if (nextProps.ui.errors) {
      return { errors: nextProps.ui.errors };
    }

    return null;
  }

  handleOpen = () => {
    this.setState({ open: true, body: '' });
  };

  handleClose = () => {
    this.props.clearErrors();
    this.setState({ open: false, errors: {} });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ errors: {} })
    await this.props.clearErrors();
    await this.props.postScream({ body: this.state.body });
    if (Object.entries(this.state.errors).length === 0) {
      this.handleClose();
    }
  };

  render() {
    const { errors } = this.state;
    const { classes, ui } = this.props;
    const { loading } = ui;

    return (
      <>
        <TooltipButton onClick={this.handleOpen} tipTitle='Post a Scream!'>
          <AddIcon color='primary' />
        </TooltipButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth='sm'
        >
          <TooltipButton onClick={this.handleClose} tipTitle='Close' tipClassName={classes.closeButton}>
            <CloseIcon />
          </TooltipButton>
          <DialogTitle>Post a New Scream</DialogTitle>
          <DialogContent>
            <TextField
              name='body'
              type='text'
              label='SCREAM!!'
              multiline
              rows='3'
              placeholder='Scream at your fellow apes'
              error={errors.body ? true : false}
              helperText={errors.body}
              className={classes.textField}
              onChange={this.handleChange}
              fullWidth
            />
            <Button
              type='submit'
              variant='contained'
              color='primary'
              className={classes.submitButton}
              disabled={loading}
              onClick={this.handleSubmit}
            >
              Submit
              {loading && (
                <CircularProgress
                  size={30}
                  className={classes.progressSpinner}
                />
              )}
            </Button>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

PostScream.propTypes = {
  postScream: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  ui: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  ui: state.ui,
});

const mapActionsToProps = {
  postScream,
  clearErrors,
};

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(withStyles(styles)(PostScream));
