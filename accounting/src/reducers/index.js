import {combineReducers, createStore} from 'redux'
import * as actions from '../actions/actionTypes'

function accountBalance(state = {}, action) {
    switch (action.type) {
        case actions.PAY_TAX:
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

function departmentSpending(state = {}, action) {
    switch (action.type) {
        case actions.RECEIVE_SPENDING:
            return Object.assign({}, state, {
                department: [].concat.apply([], action.data.map(object => {
                    return Object.keys(object);
                })),
                spending: [].concat.apply([], action.data.map(object => {
                    return Object.keys(object).map(key => object[key])
                })),
            });
        case actions.REQUEST_SPENDING:
        default:
            return state
    }
}

function transactions(state = {history: []}, action) {
    switch (action.type) {
        case actions.RECEIVE_TRANSACTIONS:
            return Object.assign({}, state, {
                history: action.data.map(transaction => {
                    let positive = false;
                    let negative = true;
                    if (JSON.stringify(transaction.amount).search('-') === -1) {
                        transaction.amount = "+" + transaction.amount;
                        positive = true;
                        negative = false;
                    }
                    return {
                        date: transaction.date,
                        amount: transaction.amount,
                        account: transaction.account,
                        transaction: transaction.transaction,
                        positive: positive,
                        negative: negative
                    }
                }),
            });
        case actions.REQUEST_TRANSACTIONS:
        default:
            return state
    }
}

const rootReducer = combineReducers({
    accountBalance, transactions, departmentSpending
});

let store = createStore(rootReducer);

export default rootReducer