import axios from 'axios';

import {
  SET_SCREAMS,
  LOADING_DATA,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
} from '../types';
import { FB_FUNCTIONS_URL } from '../../util/constants';

export const getScreams = () => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  try {
    const axiosResponse = await axios.get(`${FB_FUNCTIONS_URL}/screams`);
    dispatch({ type: SET_SCREAMS, payload: axiosResponse.data });
  } catch (error) {
    dispatch({ type: SET_SCREAMS, payload: [] });
  }
};

export const likeScream = (screamId) => async (dispatch) => {
  try {
    const axiosResponse = await axios.get(`${FB_FUNCTIONS_URL}/screams/${screamId}/like`);
    dispatch({ type: LIKE_SCREAM, payload: axiosResponse.data });
  } catch (error) {
    console.log(error);
  }
};

export const unlikeScream = (screamId) => async (dispatch) => {
  try {
    const axiosResponse = await axios.get(`${FB_FUNCTIONS_URL}/screams/${screamId}/unlike`);
    dispatch({ type: UNLIKE_SCREAM, payload: axiosResponse.data });
  } catch (error) {
    console.log(error);
  }
};