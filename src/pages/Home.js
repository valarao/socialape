import React, { Component } from 'react';
import axios from 'axios';
import { FB_FUNCTIONS_URL } from '../util/constants';
import Grid from '@material-ui/core/Grid';
import Scream from '../components/Scream';

class Home extends Component {
  state = {
    screams: [],
  }

  async componentDidMount() {
    const screamsResponse = await axios.get(`${FB_FUNCTIONS_URL}/screams`);
    this.setState({
      screams: screamsResponse.data,
    });
  }

  render() {
    const recentScreamsMarkup = this.state.screams && this.state.screams.length !== 0 ? (
      this.state.screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
    ) : (
      <p>Loading...</p>
    );

    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {recentScreamsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <p>Profile...</p>
        </Grid>
      </Grid>
    );
  }
}

export default Home;
