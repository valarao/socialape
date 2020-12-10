import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import Grid from '@material-ui/core/Grid';

import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

import Scream from '../components/scream/Scream';
import StaticProfile from '../components/profile/StaticProfile';
import { FB_FUNCTIONS_URL } from '../util/constants';

class User extends Component {
  state = {
    profile: null,
    screamIdParam: null,
  }

  async componentDidMount() {
    const handle = this.props.match.params.handle;
    const screamId = this.props.match.params.screamId;

    if (screamId) {
      this.setState({ screamIdParam: screamId })
    }

    this.props.getUserData(handle);

    try {
      const axiosResponse = await axios.get(`${FB_FUNCTIONS_URL}/user/${handle}`);
      this.setState({ profile: axiosResponse.data.user });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { screams, loading } = this.props.data;
    const { screamIdParam } = this.state;

    const screamsMarkup = loading ? (
      <p>Loading data...</p>
    ) : screams === null ? (
      <p>No screams from this user</p>
    ) : !screamIdParam ? (
      screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
    ) : (
      screams.map((scream) => {
        if (scream.screamId !== screamIdParam) {
          return <Scream key={scream.screamId} scream={scream} />
        }

        return <Scream key={scream.screamId} scream={scream} openDialog />;
      })
    );

    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {screamsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <p>Loading Profile</p>
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
      </Grid>
    );
  }
}

User.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

const mapActionsToProps = {
  getUserData,
};

export default connect(mapStateToProps, mapActionsToProps)(User);
