import React, { Component } from 'react';
import TooltipButton from './TooltipButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import { connect } from 'react-redux';
import { likeScream, unlikeScream } from '../redux/actions/dataActions';

class LikeButton extends Component {
  isLiked = () =>
    this.props.user.likes &&
    this.props.user.likes.find((like) => like.screamId === this.props.screamId);

  likeScream = () => {
    this.props.likeScream(this.props.screamId);
  };

  unlikeScream = () => {
    this.props.unlikeScream(this.props.screamId);
  };

  render() {
    const { authenticated } = this.props.user;

    return !authenticated ? (
      <Link to='/login'>
        <TooltipButton tip='Like'>
          <FavoriteBorderIcon color='primary' />
        </TooltipButton>
      </Link>
    ) : this.isLiked() ? (
      <TooltipButton tipTitle='Unlike' onClick={this.unlikeScream}>
        <FavoriteIcon color='primary' />
      </TooltipButton>
    ) : (
      <TooltipButton tipTitle='Like' onClick={this.likeScream}>
        <FavoriteBorderIcon color='primary' />
      </TooltipButton>
    );
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {
  likeScream,
  unlikeScream,
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
