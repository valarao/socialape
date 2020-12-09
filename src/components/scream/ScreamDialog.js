import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import ChatIcon from '@material-ui/icons/Chat';

import { connect } from 'react-redux';
import { getScream, clearErrors } from '../../redux/actions/dataActions';

import TooltipButton from '../common/TooltipButton';
import LikeButton from './LikeButton';
import Comments from './Comments';
import CommentForm from './CommentForm';

const styles = (theme) => ({
  ...theme.common,
  profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  dialogContent: {
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    left: '90%',
  },
  expandButton: {
    left: '83%',
  },
  spinnerDiv: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 50,
  }
});

class ScreamDialog extends Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
    this.props.getScream(this.props.screamId);
  };

  handleClose = () => {
    this.setState({ open: false });
    this.props.clearErrors();
  };

  render() {
    const { classes, scream, ui } = this.props;
    const {
      screamId,
      body,
      createdAt,
      userImage,
      userHandle,
      likeCount,
      commentCount,
      comments,
    } = scream;
    const { loading } = ui;

    const dialogMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress size={200} thickness={2} />
      </div>
    ) : (
      <Grid container spacing={10}>
        <Grid item sm={5}>
          <img src={userImage} alt='Profile' className={classes.profileImage} />
        </Grid>
        <Grid item sm={7}>
          <Typography component={Link} color='primary' variant='h5' to={`/users/${userHandle}`}>
            {userHandle}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant='body2' color='textSecondary'>
            {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant='body1'>
            {body}
          </Typography>
          <LikeButton screamId={screamId} />
          <span>{likeCount} likes</span>
          <TooltipButton tipTitle='comments'>
            <ChatIcon color='primary' />
          </TooltipButton>
          <span>{commentCount} comments</span>
        </Grid>
        <hr className={classes.visibleSeparator} />
        <CommentForm screamId={screamId} />
        <Comments comments={comments} />
      </Grid>
    );

    return (
      <>
        <TooltipButton
          onClick={this.handleOpen}
          tipTitle='Expand Scream'
          tipClassName={classes.expandButton}
        >
          <UnfoldMoreIcon color='primary' />
        </TooltipButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth='sm'
        >
          <TooltipButton
            onClick={this.handleClose}
            tipTitle='Close'
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
            </TooltipButton>
            <DialogContent className={classes.dialogContent}>
              {dialogMarkup}
            </DialogContent>
        </Dialog>
      </>
    );
  }
}

ScreamDialog.propTypes = {
  getScream: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  screamId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  scream: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  scream: state.data.scream,
  ui: state.ui,
});

const mapActionsToProps = {
  getScream,
  clearErrors,
};

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(withStyles(styles)(ScreamDialog));
