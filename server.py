from flask import Flask, request, render_template, redirect, url_for
from flask.ext.api import status
import datetime
import dataset
import json

app = Flask(__name__)

MAIN_ACCOUNT_ID = 1
UI_ROUTE_PREFIX = '/ui'


@app.route('/')
def hello():
	return 'Hello world'


@app.route('/salary',methods=['POST'])
def salary():
	ui_request = request.form is not None
	data = request.form if ui_request else json.loads(request.data)
	if data['Amount'] and data['Department'] and data['UserID'] and data['Name']:
		amount = float(data['Amount'])
		taxAmount = amount * 0.15
		amount += taxAmount
		department = data['Department']
		userId = int(data['UserID'])
		name = data['Name']
		date = datetime.datetime.now().strftime("%B %d %Y")
		db = dataset.connect('sqlite:///enterprise.db')	
		table = db['SalaryTransactions']
		pk = len(table)
		payload = {'transactionId':pk,'date':date,
		'postTaxAmount':amount,'department':department,
		'taxAmount':taxAmount,'accountId':MAIN_ACCOUNT_ID,
		'userId':userId}
		table.insert(payload)
		table = db['accounts']
		account = table.find_one(name='main')
		bal = account['balance'] - amount
		table.update(dict(id=1,name="main",balance=bal),['name'])
		return '',status.HTTP_200_OK
	return '',status.HTTP_400_BAD_REQUEST		
	

@app.route(UI_ROUTE_PREFIX + '/salary', methods=['GET'])
def salary_ui():
	return render_template('salary.html')


if __name__ == "__main__":
	app.run()
