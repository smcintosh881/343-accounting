import {combineReducers} from 'redux'
import {
    REQUEST_BALANCE, RECEIVE_BALANCE
} from '../actions/index';

function accountBalance(state = {}, action) {
    switch (action.type) {
        case RECEIVE_BALANCE:
            return Object.assign({}, state, {
                balance: action.data[0].balance,
                taxes: action.data[1].balance,
            });
        case REQUEST_BALANCE:
        default:
            return state
    }
}

const rootReducer = combineReducers({
    accountBalance,
});

export default rootReducer