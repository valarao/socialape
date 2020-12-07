import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import { deleteScream } from '../redux/actions/dataActions';
import TooltipButton from './TooltipButton';

const styles = {
  deleteButton: {
    position: 'absolute',
    left: '90%',
    top: '5%',
  }
};

class DeleteScream extends Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  deleteScream = () => {
    this.props.deleteScream(this.props.screamId);
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <>
        <TooltipButton
          tipTitle='Delete Scream'
          onClick={this.handleOpen}
          btnClassName={classes.deleteButton}
        >
          <DeleteOutlineIcon color='secondary' />
        </TooltipButton>
        <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth='sm'>
          <DialogTitle>
            Are you sure you want to delete this scream?
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.handleClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={this.deleteScream} color='secondary'>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  deleteScream,
};

DeleteScream.propTypes = {
  deleteScream: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
};

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(withStyles(styles)(DeleteScream));
