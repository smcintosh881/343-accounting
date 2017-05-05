
import fetch from 'isomorphic-fetch'

export const REQUEST_BALANCE = 'REQUEST_BALANCE';
export const RECEIVE_BALANCE = 'RECEIVE_BALANCE';

function requestBalance() {
  return {
    type: REQUEST_BALANCE
  }
}

function receiveBalance(json) {
  return {
    type: RECEIVE_BALANCE,
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
  return (dispatch, getState) => {
      return dispatch(fetchBalance())
  }
}