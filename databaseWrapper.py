import datetime
import dataset
import json
import time
import sys

MAIN_ACCOUNT_ID = 1
DATE_FORMAT = "%B %d %Y %H:%M:%S:%f"

"""
Withdraws a specified amount from the specified account

@param db: database instance
@param amount: (float) amount to withdraw from the account
@param account_id: id of the account to withdraw from, main account
id by default
"""
def withdraw_amount(db,amount,account_id=MAIN_ACCOUNT_ID):
	table = db['Accounts']
	account = table.find_one(name='main')
	if amount > sys.float_info.max:
		amount = sys.float_info.max
	bal = account['balance'] - amount
	if bal < sys.float_info.min:
		bal = sys.float_info.min
	table.update(dict(name='main',balance=bal),['name'])

"""
Deposits a specified amount into the specified account

@param db: database instance
@param amount: (float) amount to deposit into the account
@param account_id: id of the account to deposit into, main account
id by default
"""
def deposit_amount(db,amount,account_id=MAIN_ACCOUNT_ID):
	table = db['Accounts']
	if amount > sys.float_info.max:
		amount = sys.float_info.max
	account = table.find_one(name='main')
	bal = account['balance'] + amount
	if bal > sys.float_info.max:
		bal = sys.float_info.max
	table.update(dict(name='main',balance=bal),['name'])

"""
Register an amount of taxes owed

@param db: database instance
@param amount: (float) amount of owed taxes to register into the tax account
"""
def register_tax_amount(db,amount):
	table = db['Accounts']
	account = table.find_one(name="tax")
	bal = account['balance'] + amount
	table.update(dict(name='tax',balance=bal),['name'])

"""
Pay a specified amount of owed taxes

@param db: database instance
@param amount: (float) amount of owed taxes to register into the tax account
"""
def pay_tax_amount(db,amount,register=True,accountId=1):
	if db is None:
		db = get_db()
	table = db['Accounts']
	account = table.find_one(name="tax")
	withdraw_amount(db,amount)
	bal = account['balance'] - amount
	if register:
		make_tax_transaction(db,amount)
	table.update(dict(name='tax',balance=bal),['name'])
	table = db['TaxPayments']	
	taxPayment = {
		'id': len(table),
		'date' : datetime.datetime.now().strftime(DATE_FORMAT),
		'amount' : amount,
		'accountId' : accountId
	}
	table.insert(taxPayment)

"""
Log a tax payment in the database

@param db: database instance
@param amount: (float) amount of tax paid in transaction
"""
def make_tax_transaction(db,amount):
	table = db['TaxTransactions']
	pk = len(table)
	payload = {
		'date':datetime.datetime.now().strftime(DATE_FORMAT),
		'id':pk,
		'amount':amount
	}
	table.insert(payload)



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
	withdraw_amount(db,payload['postTaxAmount']-payload['taxAmount'])
	register_tax_amount(db,payload['taxAmount'])

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
	action(db,payload['postTaxAmount']-payload['taxAmount'])
	if payload['transactionType'] == 'withdrawal':
		pay_tax_amount(db,payload['taxAmount'],register=False)
	else:
		register_tax_amount(db,payload['taxAmount'])

	

"""
Creates a salaryTransaction with the data stored in payload
"""
def salaryTransaction(payload):
	db = get_db()
	table = db['SalaryTransactions']
	pk = len(table)
	add_id_and_account_to_payload(payload,pk)
	table.insert(payload)
	withdraw_amount(db,payload['postTaxAmount']-payload['taxAmount'])
	register_tax_amount(db,payload['taxAmount'])


def getTransactionHistory():
	db = get_db()
	table = db['SalaryTransactions']
	transactions = []
	for i in table.all():
		t = {}
		t['date'] = i['date']
		t['amount'] = (i['postTaxAmount'] - i['taxAmount']) * -1
		t['account'] = i['accountId']
		transactions.append(t)
	table = db['SalesTransactions']
	for i in table.all():
		t = {}
		t['date'] = i['date']
		t['amount'] = (i['postTaxAmount'] - i['taxAmount']) * (-1 if i['transactionType'] == 'withdrawal' else 1)
		t['account'] = i['accountId']
		transactions.append(t)
	table = db['InventoryTransactions']
	for i in table.all():
		t = {}
		t['date'] = i['date']
		t['amount'] = (i['postTaxAmount'] - i['taxAmount']) * -1
		t['account'] = i['accountId']
		transactions.append(t)
	table = db['InventoryTransactions']
	for i in table.all():
		t = {}
		t['date'] = i['date']
		t['amount'] = i['amount'] * -1
		t['account'] = i['accountId']
		transactions.append(t)
	transactions = sorted(transactions, key=lambda k: time.mktime(time.strptime(k['date'],DATE_FORMAT)),reverse=False)
	return json.dumps(transactions)

"""
Returns a json object with all
transactions, accounts, and their
respective information
"""
def get_reporting_info():
	db = get_db()
	salesTransactions = get_all_from_table(db['SalesTransactions'])
	salaryTransactions = get_all_from_table(db['SalaryTransactions'])
	inventoryTransactions = get_all_from_table(db['InventoryTransactions'])
	taxTransactions = get_all_from_table(db['TaxTransactions'])
	accounts = get_all_from_table(db['Accounts'])
	info ={
		'accounts':accounts,
		'inventoryTransactions':inventoryTransactions,
		'salaryTransactions':salaryTransactions,
		'salesTransactions':salesTransactions,
		'taxTransactions':taxTransactions
	}
	return json.dumps(info)

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

"""
Helper function to get all
records from a table in a list
"""
def get_all_from_table(table):
	records = []
	for i in table:
		records.append(i)
	return records
