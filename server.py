from flask import Flask, request, render_template, redirect, url_for
from flask.ext.api import status
import datetime
import dataset
import json

app = Flask(__name__)

MAIN_ACCOUNT_ID = 1
UI_ROUTE_PREFIX = '/ui'
INVENTORY_TAX = 0.08
SALARY_TAX = 0.15

"""
Hello world page for this app
#TODO: Possibly remove this soon
"""
@app.route('/')
def hello():
	return 'Hello world'


"""
Endpoint for the salary transaction API
This only takes POST requests, will make
a new salaryTransaction in the db if possible
and withdraw the salary amount from the main
account
"""
@app.route('/salary',methods=['POST'])
def salary():
	data = request.form if not request.data else json.loads(request.data)
	if data['Amount'] and data['Department'] and data['UserID'] and data['Name']:
		try:
			amount = float(data['Amount'])
			userId = int(data['UserID'])
		except:
			return malformed_request()
		taxAmount = amount * SALARY_TAX
		amount += taxAmount
		department = data['Department']
		name = data['Name']
		db = get_db()
		table = db['SalaryTransactions']
		pk = len(table)
		payload = {'transactionId':pk,'date':get_date(),
		'postTaxAmount':amount,'department':department,
		'taxAmount':taxAmount,'accountId':MAIN_ACCOUNT_ID,
		'userId':userId}
		table.insert(payload)
		withdraw_amount(db,amount)
		return ok_status()
	return malformed_request()

"""
Endpoint for the SalesTransaction API
THis only takes POST requests, will make
a new SalesTransaction in the db if possible
and withdraw or deposit the amount specified
in the request from the main account
"""
@app.route('/sale',methods=['POST'])
def sale():
	data = json.loads(request.data)
	if data['preTaxAmount'] and data['taxAmount'] and data['transactionType'] and data['salesID']:
		try:
			preTaxAmount = float(data['preTaxAmount'])
			taxAmount = float(data['taxAmount'])
			salesId = int(data['salesID'])
			transactionType = data['transactionType'].lower()
			if transactionType != "deposit" and transactionType != "withdrawal":
				return malformed_request()
			action = withdraw_amount if transactionType == 'withdrawal' else deposit_amount
		except:
			return malformed_request()
		amount = preTaxAmount + taxAmount
		db = get_db()
		table = db['SalesTransactions']
		pk = len(table)
		payload = {'transactionId':pk,'date': get_date(),
		'postTaxAmount':amount,'taxAmount':taxAmount,
		'transactionType':transactionType,'salesId':salesId,
		'accountId':MAIN_ACCOUNT_ID}
		table.insert(payload)
		action(db,amount)
		return ok_status()
	return malformed_request()

"""
Endpoint for the InventoryTransaction API,
this only takes POST requests. Will make a new
InventoryTransaction in the db if possible and
withdraw the amount specified from the main account
"""
@app.route('/inventory',methods=['POST'])
def inventory():
	data = request.form if not request.data else json.loads(request.data)
	try:
		amount = float(data['Amount'])
	except:
		return malformed_request()
	taxAmount = amount*INVENTORY_TAX
	postTaxAmount = amount+taxAmount
	db = get_db()
	table = db['InventoryTransactions']
	pk = len(table)
	payload = {'transactionId':pk,'date':get_date(),
	'postTaxAmount':postTaxAmount,'taxAmount': taxAmount,
	'accountId': MAIN_ACCOUNT_ID}
	table.insert(payload)
	withdraw_amount(db,postTaxAmount)
	return ok_status()

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
def deposit_amount(db,amount,account_id=1):
	table = db['accounts']
	account = table.find_one(name='main')
	bal = account['balance'] + amount
	table.update(dict(name='main',balance=bal),['name'])

"""
Helper function to get the current date as a string
"""
def get_date():
	return datetime.datetime.now().strftime("%B %d %Y")

"""
Returns bad request response, return this when you get a bad request
"""
def malformed_request():
	return '{\"error_message\":\"Bad Request\"}',status.HTTP_400_BAD_REQUEST

"""
Helper function to get an instance of the database
"""
def get_db():
	return dataset.connect('sqlite:///enterprise.db')

"""
Returns ok status response, return this when your request is successfully processed
"""
def ok_status():
	return '',status.HTTP_200_OK

# UI Pages


@app.route(UI_ROUTE_PREFIX + '/salary', methods=['GET'])
def salary_ui():
	"""
	A page that allows users to make salary transactions
	:return: the salary transaction page
	"""
	return render_template('salary.html')


@app.route(UI_ROUTE_PREFIX + '/inventory')
def inventory_ui():
	"""
	A page where a user can make an inventory transaction
	:return: the inventory transaction page
	"""
	return render_template('inventory.html')


@app.route(UI_ROUTE_PREFIX + '/sale')
def sale_ui():
	"""
	A page where a user can log a sale or a return
	:return: the sales logging page
	"""
	return render_template('sale.html')

if __name__ == "__main__":
	app.run(host='0.0.0.0', port=5000)
