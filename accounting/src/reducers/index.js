import {combineReducers, createStore} from 'redux'
import * as actions from '../actions/actionTypes'

function accountBalance(state = {}, action) {
    switch (action.type) {
        case actions.PAY_TAX:
            return Object.assign({}, state, {
                taxes: 0
            });
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
                })
            });
        case actions.REQUEST_TRANSACTIONS:
        default:
            return state
    }
}

const rootReducer = combineReducers({
    accountBalance, transactions
});

let initialState = {
    transactions: {
        history: [
            {
                date: '',
                amount: 0,
                account: '',
                transaction: ''
            }
        ]
    }
};

let store = createStore(rootReducer);

export default rootReducer