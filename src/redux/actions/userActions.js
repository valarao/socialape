import axios from 'axios';

import { FB_FUNCTIONS_URL } from '../../util/constants';
import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
} from '../types';

export const loginUser = (userData, history) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_UI });
    const axiosResponse = await axios.post(
      `${FB_FUNCTIONS_URL}/login`,
      userData,
    );

    setAuthorizationHeader(axiosResponse.data.token);
    dispatch(getUserData());
    dispatch({ type: CLEAR_ERRORS });

    history.push('/');
  } catch (error) {
    dispatch({
      type: SET_ERRORS,
      payload: error.response.data,
    });
  }
};

export const signupUser = (newUserData, history) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_UI });
    const axiosResponse = await axios.post(
      `${FB_FUNCTIONS_URL}/signup`,
      newUserData,
    );
    setAuthorizationHeader(axiosResponse.data.token);
    dispatch(getUserData());
    dispatch({ type: CLEAR_ERRORS });

    history.push('/');
  } catch (error) {
    dispatch({
      type: SET_ERRORS,
      payload: error.response.data,
    });
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('FBIdToken');
  delete axios.defaults.headers.common['Authorization'];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const getUserData = () => async (dispatch) => {
  try {
    dispatch({ type: LOADING_USER });
    const axiosResponse = await axios.get(`${FB_FUNCTIONS_URL}/user`);
    dispatch({ type: SET_USER, payload: axiosResponse.data });
  } catch (error) {
    console.log(error);
  }
};

export const uploadImage = (formData) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_USER });
    await axios.post(`${FB_FUNCTIONS_URL}/user/image`, formData);
    dispatch(getUserData());
  } catch (error) {
    console.log(error);
  }
};

export const editUserDetails = (userDetails) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_USER });
    await axios.post(`${FB_FUNCTIONS_URL}/user`, userDetails);
    dispatch(getUserData());
  } catch (error) {
    console.log(error);
  }
};

const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem('FBIdToken', FBIdToken);
  axios.defaults.headers.common['Authorization'] = FBIdToken;
};
