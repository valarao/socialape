import axios from 'axios';

import {
  SET_SCREAMS,
  LOADING_DATA,
  LOADING_UI,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  POST_SCREAM,
  SET_ERRORS,
  CLEAR_ERRORS
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

export const postScream = (newScream) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_UI });
    const axiosResponse = await axios.post(`${FB_FUNCTIONS_URL}/scream`, newScream);
    dispatch({ type: POST_SCREAM, payload: axiosResponse.data });
    dispatch({ type: CLEAR_ERRORS });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
}

export const likeScream = (screamId) => async (dispatch) => {
  try {
    const axiosResponse = await axios.get(`${FB_FUNCTIONS_URL}/scream/${screamId}/like`);
    dispatch({ type: LIKE_SCREAM, payload: axiosResponse.data });
  } catch (error) {
    console.log(error);
  }
};

export const unlikeScream = (screamId) => async (dispatch) => {
  try {
    const axiosResponse = await axios.get(`${FB_FUNCTIONS_URL}/scream/${screamId}/unlike`);
    dispatch({ type: UNLIKE_SCREAM, payload: axiosResponse.data });
  } catch (error) {
    console.log(error);
  }
};

export const deleteScream = (screamId) => async (dispatch) => {
  try {
    await axios.delete(`${FB_FUNCTIONS_URL}/scream/${screamId}`);
    dispatch({ type: DELETE_SCREAM, payload: screamId });
  } catch (error) {
    console.log(error);
  } 
};

export const clearErrors = () => (dispatch) => {
  try {
    dispatch({ type: CLEAR_ERRORS });
  } catch (error) {
    console.log(error);
  }
}
