import {
  SET_SCREAMS,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  LOADING_DATA,
  DELETE_SCREAM,
  POST_SCREAM,
} from '../types';

const initialState = {
  screams: [],
  scream: {},
  loading: false,
};

const dataReducer = (state = initialState, action) => {
  let index = 0;
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_SCREAMS:
      return {
        ...state,
        screams: action.payload,
        loading: false,
      };
    case POST_SCREAM:
      return {
        ...state,
        screams: [
          action.payload,
          ...state.screams,
        ]
      }
    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      index = state.screams.findIndex(
        (scream) => scream.screamId === action.payload.screamId,
      );
      state.screams[index] = action.payload;
      return {
        ...state,
      };
    case DELETE_SCREAM:
      index = state.screams.findIndex(
        (scream) => scream.screamId === action.payload,
      );
      state.screams.splice(index, 1);
      return {
        ...state,
      }
    default:
      return state;
  }
};

export default dataReducer;
