import {combineReducers, createStore} from 'redux'
import * as actions from '../actions/actionTypes'
import Moment from 'moment';

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

function xAgo(eventTime) {
    /*
     const monthNames = ["", "January", "February", "March", "April", "May", "June",
     "July", "August", "September", "October", "November", "December"
     ];
     let date = new Date();
     let stringArray = eventTime.split(/(\s+)/);
     date.setMonth(monthNames.indexOf(stringArray[0]));
     */

    return Moment(eventTime, "MMM DD YYYY HH:mm:ss:SSS").fromNow();

}

function transactions(state = {history: []}, action) {
    switch (action.type) {
        case actions.RECEIVE_TRANSACTIONS:
            return Object.assign({}, state, {
                history: action.data.map(transaction => {
                    return {
                        date: xAgo(transaction.date),
                        amount: transaction.amount,
                        account: transaction.account,
                        transaction: transaction.transaction
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