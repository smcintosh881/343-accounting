import fetch from 'isomorphic-fetch'
import * as actions from './actionTypes';

/* ACCOUNT BALANCES */

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
        dispatch(requestBalance());
        return fetch('/api/accounts')
            .then(response => response.json())
            .then(json => dispatch(receiveBalance(json)))
    }
}

export function fetchBalanceInitial() {
    return (dispatch) => {
        return dispatch(fetchBalance());
    }
}

/* Department Spending PiChart */

function requestDepartmentSpending() {
    return {
        type: actions.REQUEST_SPENDING
    }
}

function receiveDepartmentSpending(json) {
    return {
        type: actions.RECEIVE_SPENDING,
        data: json
    }
}

function fetchDepartmentSpending() {
    return dispatch => {
        dispatch(requestDepartmentSpending());
        return fetch('/api/departmentSpending')
            .then(response => response.json())
            .then(json => dispatch(receiveDepartmentSpending(json)))
    }
}

export function fetchSpending() {
    return (dispatch) => {
        return dispatch(fetchDepartmentSpending());
    }
}

/* TRANSACTION HISTORY */

function filterTransactions(payload) {
    return (dispatch) => {
        return fetch('/api/reporting', {
            method: 'POST',
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(json => dispatch(ReceiveFilterTransactions(json)))
    }
}

function ReceiveFilterTransactions(json) {
    return {
        type: actions.RECEIVE_TRANSACTIONS,
        data: json
    }
}

export function fetchFilterTransactions(payload) {
    return (dispatch) => {
        return dispatch(filterTransactions(payload))
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
        dispatch(requestTransactions());
        return fetch('/api/reporting', {
            method: 'POST',
        })
            .then(response => response.json())
            .then(json => dispatch(receiveTransactions(json)))
    }
}

export function fetchTransactionsInitial() {
    return (dispatch) => {
        return dispatch(fetchTransactions())
    }
}

/* PAY TAX */

function pay(json) {
    return {
        type: actions.PAY_TAX,
        data: json
    }
}

function postPayTax(payload) {
    return dispatch => {
        return fetch('/api/paytax', {
            method: 'post',
            body: JSON.stringify(payload)
        }).then(response => response.json())
            .then(json => dispatch(pay(json)))
    }
}

export function payTaxesAction(payload) {
    return (dispatch) => {
        return dispatch(postPayTax(payload))
    }
}

/* Account Balance Line Graph */

function receiveAccountBalance(json) {
    return {
        type: actions.RECEIVE_ACCOUNT_BALANCE_GRAPH,
        data: json
    }
}

function accountBalance(payload) {
    return dispatch => {
        return fetch('/api/balances')
            .then(response => response.json())
            .then(json => dispatch(receiveAccountBalance(json)))
    }
}

export function accountBalanceGraph(payload) {
    return (dispatch) => {
        return dispatch(accountBalance(payload))
    }
}
