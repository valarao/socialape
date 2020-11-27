import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Scream from '../components/Scream';

class Home extends Component {
  state = {
    screams: null,
  }

  async componentDidMount() {
    const screamsResponse = await axios.get('/screams');
    this.setState({
      screams: screamsResponse.data,
    });
  }

  render() {
    const recentScreamsMarkup = this.state.screams != null ? (
      this.state.screams.map((scream, index) => <Scream key={index} scream={scream} />)
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
