import datetime
import dataset
import json
import time

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
	table = db['accounts']
	account = table.find_one(name='main')
	bal = float(account['balance']) - amount
	if bal <= 0:
		return False
		print  "amount too high"
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
	bal = float(account['balance']) + amount
	table.update(dict(name='main',balance=bal),['name'])

"""
Register an amount of taxes owed

@param db: database instance
@param amount: (float) amount of owed taxes to register into the tax account
"""
def register_tax_amount(db,amount):
	table = db['accounts']
	account = table.find_one(name="tax")
	bal = float(account['balance']) + amount
	table.update(dict(name='tax',balance=bal),['name'])

"""
Pay a specified amount of owed taxes

@param db: database instance
@param amount: (float) amount of owed taxes to register into the tax account
"""
def pay_tax_amount(db,amount,register=True,accountId=1):
	if db is None:
		db = get_db()
	table = db['accounts']
	account = table.find_one(name="tax")
	bal = float(account['balance']) - amount
	if bal < 0 or withdraw_amount(db,amount) == False:
		return False
	if register:
		make_tax_transaction(db,amount)
	table.update(dict(name='tax',balance=bal),['name'])
	table = db['taxpayments']	
	taxPayment = {
		'id': len(table),
		'date' : datetime.datetime.now().strftime(DATE_FORMAT),
		'amount' : amount,
		'accountid' : accountId
	}
	table.insert(taxPayment)

"""
Log a tax payment in the database

@param db: database instance
@param amount: (float) amount of tax paid in transaction
"""
def make_tax_transaction(db,amount):
	table = db['taxtransactions']
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
	return dataset.connect('postgresql://accounting:Lpb3LMDMfaBd63bY3NayRA8ukVWscx@localhost:5432/enterprise') 

"""
Creates an inventory transaction with data stored in payload
"""
def inventoryTransaction(payload):
	db = get_db()
	table = db['inventorytransactions']
	pk = len(table)
	add_id_and_account_to_payload(payload,pk)	
	if withdraw_amount(db,payload['posttaxamount']-payload['taxamount']) == False:
		return False
	table.insert(payload)
	register_tax_amount(db,payload['taxamount'])

"""
Creates a salesTransaction with the data stored in payload
"""
def salesTransaction(payload):
	db = get_db()
	table = db['salestransactions']
	pk = len(table)
	add_id_and_account_to_payload(payload,pk)
	action = withdraw_amount if payload['transactiontype'] == 'withdrawal' else deposit_amount
	if action(db,payload['posttaxamount']-payload['taxamount']) == False:
		return False	
	if payload['transactiontype'] == 'withdrawal':
		if pay_tax_amount(db,payload['taxamount'],register=False) == False:
			withdraw_amount(db,payload['taxamount'])
	else:
		register_tax_amount(db,payload['taxamount'])
	table.insert(payload)

"""
Creates a salaryTransaction with the data stored in payload
"""
def salaryTransaction(payload):
	db = get_db()
	table = db['salarytransactions']
	pk = len(table)
	add_id_and_account_to_payload(payload,pk)
	if withdraw_amount(db,payload['posttaxamount']-payload['taxamount']) == False:
		return False
	register_tax_amount(db,payload['taxamount'])
	table.insert(payload)

def getTransactionHistory(order=1):
	db = get_db()
	table = db['salarytransactions']
	transactions = []
	for i in table.all():
		t = {}
		t['date'] = i['date']
		t['amount'] = float(i['posttaxamount'] - i['taxamount']) * -1
		t['account'] = i['accountid']
		transactions.append(t)
	table = db['salestransactions']
	for i in table.all():
		t = {}
		t['date'] = i['date']
		t['amount'] = float(i['posttaxamount'] - i['taxamount']) * (-1 if i['transactiontype'] == 'withdrawal' else 1)
		t['account'] = i['accountid']
		transactions.append(t)
	table = db['inventorytransactions']
	for i in table.all():
		t = {}
		t['date'] = i['date']
		t['amount'] = float(i['posttaxamount'] - i['taxamount']) * -1
		t['account'] = i['accountid']
		transactions.append(t)
	table = db['inventorytransactions']
	for i in table.all():
		t = {}
		t['date'] = i['date']
		t['amount'] = float(i['posttaxamount'] - i['taxamount']) * -1
		t['account'] = i['accountid']
		transactions.append(t)
	transactions = sorted(transactions, key=lambda k: time.mktime(time.strptime(k['date'],DATE_FORMAT)),reverse=(order==1))
	return json.dumps(transactions)

"""
Returns a json object with all
transactions, accounts, and their
respective information
"""
def get_reporting_info():
	db = get_db()
	salesTransactions = get_all_from_table(db['salestransactions'])
	salaryTransactions = get_all_from_table(db['salarytransactions'])
	inventoryTransactions = get_all_from_table(db['inventorytransactions'])
	taxTransactions = get_all_from_table(db['taxtransactions'])
	accounts = get_all_from_table(db['accounts'])
	info ={
		'accounts':accounts,
		'inventorytransactions':inventoryTransactions,
		'salarytransactions':salaryTransactions,
		'salestransactions':salesTransactions,
		'taxtransactions':taxTransactions
	}
	return json.dumps(info)

def get_account_balances():
	accounts = []
	db = get_db()
	for account in db['accounts']:
		accounts.append({
			'id': account['id'],
			'balance': float(account['balance'])
		})
	return json.dumps(accounts)

def add_id_and_account_to_payload(payload,pk):
	payload['transactionid'] = pk
	if 'accountid' not in payload.keys():
		payload['accountid']=MAIN_ACCOUNT_ID

"""
Helper function to get all
records from a table in a list
"""
def get_all_from_table(table):
	records = []
	for i in table:
		records.append(i)
	return records
