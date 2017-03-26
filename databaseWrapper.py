import dataset
import json
import time

MAIN_ACCOUNT_ID = 1

"""
Withdraws a specified amount from the specified account

@param db: database instance
@param amount: (float) amount to withdraw from the account
@param account_id: id of the account to withdraw from, main account
id by default
"""
def withdraw_amount(db,amount,account_id=MAIN_ACCOUNT_ID):
	table = db['accounts']
	account = table.find_one(name='main')
	bal = account['balance'] - amount
	table.update(dict(name='main',balance=bal),['name'])

"""
Deposits a specified amount into the specified account

@param db: database instance
@param amount: (float) amount to deposit into the account
@param account_id: id of the account to deposit into, main account
id by default
"""
def deposit_amount(db,amount,account_id=MAIN_ACCOUNT_ID):
	table = db['accounts']
	account = table.find_one(name='main')
	bal = account['balance'] + amount
	table.update(dict(name='main',balance=bal),['name'])


"""
Helper function to get an instance of the database
"""
def get_db():
	return dataset.connect('sqlite:///enterprise.db')

"""
Creates an inventory transaction with data stored in payload
"""
def inventoryTransaction(payload):
	db = get_db()
	table = db['InventoryTransactions']
	pk = len(table)
	add_id_and_account_to_payload(payload,pk)
	table.insert(payload)
	withdraw_amount(db,payload['postTaxAmount'])

"""
Creates a salesTransaction with the data stored in payload
"""
def salesTransaction(payload):
	db = get_db()
	table = db['SalesTransactions']
	pk = len(table)
	add_id_and_account_to_payload(payload,pk)
	table.insert(payload)
	action = withdraw_amount if payload['transactionType'] == 'withdrawal' else deposit_amount
	action(db,payload['postTaxAmount'])

"""
Creates a salaryTransaction with the data stored in payload
"""
def salaryTransaction(payload):
	db = get_db()
	table = db['SalaryTransactions']
	pk = len(table)
	add_id_and_account_to_payload(payload,pk)
	table.insert(payload)
	withdraw_amount(db,payload['postTaxAmount'])

def getTransactionHistory():
	db = get_db()
	table = db['SalaryTransactions']
	transactions = []
	for i in table.all():
		t = {}
		t['date'] = i['date']
		t['amount'] = i['postTaxAmount'] * -1
		t['account'] = i['accountId']
		transactions.append(t)
	table = db['SalesTransactions']
	for i in table.all():
		t = {}
		t['date'] = i['date']
		t['amount'] = i['postTaxAmount'] * (-1 if i['transactionType'] == 'withdrawal' else 1)
		t['account'] = i['accountId']
		transactions.append(t)
	table = db['InventoryTransactions']
	for i in table.all():
		t = {}
		t['date'] = i['date']
		t['amount'] = i['postTaxAmount'] * -1
		t['account'] = i['accountId']
		transactions.append(t)
	transactions = sorted(transactions, key=lambda k: time.mktime(time.strptime(k['date'],"%B %d %Y")),reverse=False)
	return json.dumps(transactions)

def get_account_balances():
	accounts = []
	db = get_db()
	for account in db['Accounts']:
		accounts.append({
			'id': account['id'],
			'balance': account['balance']
		})
	return json.dumps(accounts)

def add_id_and_account_to_payload(payload,pk):
	payload['transactionId'] = pk
	if 'accountId' not in payload.keys():
		payload['accountId']=MAIN_ACCOUNT_ID
