import {combineReducers} from 'redux'
import * as actions from '../actions/actionTypes'


function accountBalance(state = {}, action) {
    switch (action.type) {
        case actions.RECEIVE_BALANCE:
            return Object.assign({}, state, {
                balance: action.data[0].balance,
                taxes: action.data[1].balance,
            });
        case actions.REQUEST_BALANCE:
        default:
            return state
    }
}

function transactions(state = {}, action) {
    switch (action.type) {
        case actions.RECEIVE_TRANSACTIONS:
            return Object.assign({}, state, {
                temp: data
            });
        case actions.REQUEST_TRANSACTIONS:
        default:
            return state
    }
}
const rootReducer = combineReducers({
    accountBalance, transactions
});

export default rootReducer