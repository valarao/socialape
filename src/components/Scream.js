import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';


import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import { likeScream, unlikeScream } from '../redux/actions/dataActions';

const styles = {
  card: {
    display: 'flex',
    marginBottom: 20,
  },
  image: {
    width: 200,
  },
  content: {
    padding: 20,
    objectFit: 'cover',
  },
};

class Scream extends Component {
  render() {
    const { classes, scream } = this.props;
    const {
      body,
      createdAt,
      userImage,
      userHandle,
    } = scream;
    dayjs.extend(relativeTime);
    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          title='Profile image'
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography color='primary' variant='h5' component={Link} to={`/users/${userHandle}`}>
            {userHandle}
          </Typography>
          <Typography variant='body2'>{dayjs(createdAt).fromNow()}</Typography>
          <Typography variant='body1'>{body}</Typography>
        </CardContent>
      </Card>
    );
  }
}

Scream.propTypes = {
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {
  likeScream,
  unlikeScream,
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Scream));
