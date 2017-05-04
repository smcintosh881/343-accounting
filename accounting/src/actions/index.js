import fetch from 'isomorphic-fetch'
import * as actions from './actionTypes'

function requestBalance() {
    return {
        type: actions.REQUEST_BALANCE
    }
}

function receiveBalance(json) {
    return {
        type: actions.RECEIVE_BALANCE,
        data: json
    }
}

function fetchBalance() {
    return dispatch => {
        dispatch(requestBalance())
        return fetch('/api/accounts')
            .then(response => response.json())
            .then(json => dispatch(receiveBalance(json)))
    }
}

export function fetchBalanceInitial() {
    return (dispatch) => {
        return dispatch(fetchBalance())
    }
}

function requestTransactions() {
    return {
        type: actions.REQUEST_TRANSACTIONS
    }
}

function receiveTransactions(json) {
    return {
        type: actions.RECEIVE_TRANSACTIONS,
        data: json
    }
}

function fetchTransactions() {
    return dispatch => {
        dispatch(requestTransactions())
        return fetch('/api/reporting')
            .then(response => response.json())
            .then(json => dispatch(receiveTransactions(json)))
    }
}

export function fetchTransactionsInitial() {
    return (dispatch) => {
        return dispatch(fetchTransactions())
    }
}