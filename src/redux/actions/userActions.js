import axios from 'axios';

import { FB_FUNCTIONS_URL } from '../../util/constants';
import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI } from '../types';

export const loginUser = (userData, history) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_UI });
    const axiosResponse = await axios.post(
      `${FB_FUNCTIONS_URL}/login`,
      userData,
    );
    const FBIdToken = `Bearer ${axiosResponse.data.token}`;
    localStorage.setItem('FBIdToken', FBIdToken);
    axios.defaults.headers.common['Authorization'] = FBIdToken;
    
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

export const getUserData = () => async (dispatch) => {
  try {
    const axiosResponse = await axios.get(`${FB_FUNCTIONS_URL}/user`);
    dispatch({ type: SET_USER, payload: axiosResponse.data });
  } catch (error) {
    console.log(error);
  }
};
