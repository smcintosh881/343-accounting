import {combineReducers, createStore} from 'redux'
import * as actions from '../actions/actionTypes'

function accountBalance(state = {}, action) {
    switch (action.type) {
        case actions.PAY_TAX:
        case actions.RECEIVE_BALANCE:
            return Object.assign({}, state, {
                balance: action.data[0].balance.toLocaleString(),
                taxes: action.data[1].balance.toLocaleString(),
            });
        case actions.REQUEST_BALANCE:
        default:
            return state
    }
}

function graph(state = {}, action) {
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
        case actions.RECEIVE_ACCOUNT_BALANCE_GRAPH:
            return Object.assign({}, state, {
                month: action.data.map(object => {
                    return object.date;
                }),
                balances: action.data.map(object => {
                    return parseInt(object.balance, 10);
                }),
            });
        default:
            return state
    }
}

function transactions(state = {}, action) {
    switch (action.type) {
        case actions.RECEIVE_TRANSACTIONS:
            return action.data.map(transaction => {
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
            });
        default:
            return state
    }
}

const rootReducer = combineReducers({
    accountBalance, transactions, graph
});


export default rootReducer