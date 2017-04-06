from flask import Flask, request, render_template, redirect, url_for
from flask.ext.api import status
from databaseWrapper import salesTransaction, salaryTransaction, inventoryTransaction, getTransactionHistory, get_account_balances,DATE_FORMAT
import datetime
import json

app = Flask(__name__)

UI_ROUTE_PREFIX = '/ui'
INVENTORY_TAX = 0.08
SALARY_TAX = 0.15
ACCEPTED_DEPARTMENTS = [
	"Sales",
	"Accounting",
	"Human Resources",
	"Customer Support",
	"Inventory",
	"Manufacturing"
]

"""
Landing page endpoint that contains links
to Sales, Salary, Inventory and History
"""
@app.route('/')
def landing():
	return render_template('landingpage.html')


"""
Endpoint for the salary transaction API
This only takes POST requests, will make
a new salaryTransaction in the db if possible
and withdraw the salary amount from the main
account
"""
@app.route('/salary',methods=['POST'])
def salary():
	data = get_data_from_request(request)
	if data['amount'] and data['department'] and data['userID'] and data['name']:
		try:
			amount = float(data['amount'])
			userId = int(data['userID'])
		except:
			return malformed_request()
		department = data['department']
		if amount <= 0 or userId < 0 and not department in ACCEPTED_DEPARTMENTS:
			return malformed_request()
		taxAmount = amount * SALARY_TAX
		amount += taxAmount
		name = data['name']
		payload = {'date':get_date(),
		'postTaxAmount':amount,'department':department,
		'taxAmount':taxAmount,'userId':userId}
		salaryTransaction(payload)
		return ok_status()
	return malformed_request()

"""
Endpoint for the SalesTransaction API
This only takes POST requests, will make
a new SalesTransaction in the db if possible
and withdraw or deposit the amount specified
in the request from the main account
"""
@app.route('/sale',methods=['POST'])
def sale():
	data = get_data_from_request(request)
	if data['preTaxAmount'] and data['taxAmount'] and data['transactionType'] and data['salesID']:
		try:
			preTaxAmount = float(data['preTaxAmount'])
			taxAmount = float(data['taxAmount'])
			salesId = int(data['salesID'])
			transactionType = data['transactionType'].lower()
		except:
			return malformed_request()
		if preTaxAmount <= 0 or taxAmount <= 0 or salesId < 0 or (transactionType != "deposit" and transactionType != "withdrawal"):
			return malformed_request()
		amount = preTaxAmount + taxAmount
		payload = {'date': get_date(),
		'postTaxAmount':amount,'taxAmount':taxAmount,
		'transactionType':transactionType,'salesId':salesId}
		salesTransaction(payload)
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
	data = get_data_from_request(request)
	try:
		amount = float(data['amount'])
	except:
		return malformed_request()
	if amount <= 0:
		return malformed_request()
	taxAmount = amount*INVENTORY_TAX
	postTaxAmount = amount+taxAmount
	payload = {'date':get_date(),
	'postTaxAmount':postTaxAmount,
	'taxAmount': taxAmount}
	inventoryTransaction(payload)
	return ok_status()


# Internal APIs

"""
Endpoint for transaction history, only meant for use internally
by the accounting team so it is not documented in the cross-team API document(s)
"""
@app.route('/history', methods=['GET'])
def history():
	return getTransactionHistory()


"""
Endpoint for viewing account balances, only meant for use internally
by the accounting team so it is not documented in the cross-team API document(s)
"""
@app.route('/accounts', methods=['GET'])
def accounts():
	return get_account_balances()

"""
Helper function to get the current date as a string
"""
def get_date():
	return datetime.datetime.now().strftime(DATE_FORMAT)

"""
Returns bad request response, return this when you get a bad request
"""
def malformed_request():
	return '{\"error_message\":\"Bad Request\"}',status.HTTP_400_BAD_REQUEST

"""
Returns ok status response, return this when your request is successfully processed
"""
def ok_status():
	return '',status.HTTP_200_OK

"""
Helper function to get data from request
"""
def get_data_from_request(request):
	return request.form if not request.data else json.loads(request.data)


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

@app.route(UI_ROUTE_PREFIX + '/history')
def history_ui():
	return render_template('history.html')

if __name__ == "__main__":
	app.run(host='0.0.0.0', port=5000)
