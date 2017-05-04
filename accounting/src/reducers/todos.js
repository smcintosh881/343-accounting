
import { combineReducers } from 'redux';
import {REQUEST_BALANCE, RECEIVE_BALANCE} from "../actions/index";


function postsBySubreddit(state = { }, action) {
  switch (action.type) {
    case RECEIVE_BALANCE:
    case REQUEST_BALANCE:
      return state;
    default:
      return state
  }
}

const rootReducer = combineReducers({
  postsBySubreddit,
});

export default rootReducer

