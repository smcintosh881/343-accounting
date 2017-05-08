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

export function fetchBalanceInitial() {
    return (dispatch) => {
        return dispatch(fetchBalance());
    }
}

/* TRANSACTION HISTORY */

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

/* PAY TAX */

function pay(json) {
    return {
        type: actions.PAY_TAX,
        data: json
    }
}

function postPayTax({payload}) {
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