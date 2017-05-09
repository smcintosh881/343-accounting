import datetime
import dataset
import json
import time
import numpy as np

MAIN_ACCOUNT_ID = 1
DATE_FORMAT = "%B %d %Y %H:%M:%S:%f"

"""
Withdraws a specified amount from the specified account
@param db: database instance
@param amount: (float) amount to withdraw from the account
@param account_id: id of the account to withdraw from, main account
id by default
"""


def withdraw_amount(db, amount, account_id=MAIN_ACCOUNT_ID):
    table = db['accounts']
    account = table.find_one(name='main')
    bal = float(account['balance']) - amount
    if bal <= 0:
        return False
    table.update(dict(name='main', balance=bal), ['name'])


"""
Deposits a specified amount into the specified account

@param db: database instance
@param amount: (float) amount to deposit into the account
@param account_id: id of the account to deposit into, main account
id by default
"""


def deposit_amount(db, amount, account_id=MAIN_ACCOUNT_ID):
    table = db['accounts']
    account = table.find_one(name='main')
    bal = float(account['balance']) + amount
    table.update(dict(name='main', balance=bal), ['name'])


"""
Register an amount of taxes owed

@param db: database instance
@param amount: (float) amount of owed taxes to register into the tax account
"""


def register_tax_amount(db, amount):
    table = db['accounts']
    account = table.find_one(name="tax")
    bal = float(account['balance']) + amount
    table.update(dict(name='tax', balance=bal), ['name'])


"""
Pay a specified amount of owed taxes

@param db: database instance
@param amount: (float) amount of owed taxes to register into the tax account
"""


def pay_tax_amount(db, amount, register=True, accountId=1):
    if db is None:
        db = get_db()
    table = db['accounts']
    account = table.find_one(name="tax")
    bal = float(account['balance']) - amount
    if bal < 0 or withdraw_amount(db, amount) == False:
        return False
    if register:
        make_tax_transaction(db, amount)
    table.update(dict(name='tax', balance=bal), ['name'])
    table = db['taxpayments']
    taxPayment = {
        'paymentid': len(table),
        'date': datetime.datetime.now().strftime(DATE_FORMAT),
        'amount': amount,
        'accountid': accountId
    }
    table.insert(taxPayment)


"""
Log a tax payment in the database

@param db: database instance
@param amount: (float) amount of tax paid in transaction
"""


def make_tax_transaction(db, amount):
    table = db['taxtransactions']
    pk = len(table)
    payload = {
        'transactionid': pk,
        'date': datetime.datetime.now().strftime(DATE_FORMAT),
        'amount': amount
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
    add_id_and_account_to_payload(payload, pk)
    if withdraw_amount(db, payload['posttaxamount'] - payload['taxamount']) == False:
        return False
    table.insert(payload)
    register_tax_amount(db, payload['taxamount'])


"""
Creates a salesTransaction with the data stored in payload
"""


def salesTransaction(payload):
    db = get_db()
    table = db['salestransactions']
    pk = len(table)
    add_id_and_account_to_payload(payload, pk)
    action = withdraw_amount if payload['transactiontype'] == 'withdrawal' else deposit_amount
    amount = (payload['posttaxamount'] - payload['taxamount']) if payload['transactiontype'] == 'withdrawal' else payload['posttaxamount']
    if action(db, amount) == False:
        return False
    if payload['transactiontype'] == 'withdrawal':
        if pay_tax_amount(db, payload['taxamount'], register=False) == False:
            withdraw_amount(db, payload['taxamount'])
    else:
        register_tax_amount(db, payload['taxamount'])
    table.insert(payload)


"""
Creates a salaryTransaction with the data stored in payload
"""


def salaryTransaction(payload):
    db = get_db()
    table = db['salarytransactions']
    pk = len(table)
    add_id_and_account_to_payload(payload, pk)
    if withdraw_amount(db, payload['posttaxamount'] - payload['taxamount']) == False:
        return False
    register_tax_amount(db, payload['taxamount'])
    table.insert(payload)

def getTransactionHistory(order=1, withdrawal='', type=''):
    db = get_db()
    table = db['salarytransactions']
    transactions = []
    salary = []
    sales = []
    inventory = []
    taxes = []
    for i in table.all():
        t = {}
        t['date'] = i['date']
        t['amount'] = float(i['posttaxamount'] - i['taxamount']) * -1
        t['account'] = i['accountid']
        t['transaction'] = 'Salary'
        salary.append(t)

    table = db['salestransactions']
    for i in table.all():
        t = {}
        t['date'] = i['date']
        t['amount'] = float(i['posttaxamount'] - i['taxamount']) * (-1 if i['transactiontype'] == 'withdrawal' else 1)
        t['account'] = i['accountid']
        t['transaction'] = 'Sales'
        sales.append(t)

    table = db['inventorytransactions']
    for i in table.all():
        t = {}
        t['date'] = i['date']
        t['amount'] = float(i['posttaxamount'] - i['taxamount']) * -1
        t['account'] = i['accountid']
        t['transaction'] = 'Inventory'
        inventory.append(t)

    table = db['taxpayments']
    for i in table.all():
        t = {}
        t['date'] = i['date']
        t['amount'] = float(i['amount']) * -1
        t['transaction'] = 'Tax'
        taxes.append(t)

    if withdrawal == '' and type == '':
        transactions = salary + sales + inventory + taxes
        transactions = sorted(transactions, key=lambda k: time.mktime(time.strptime(k['date'], DATE_FORMAT)),
                              reverse=(order == 1))

    if type == '':
        transactions = np.array(salary + sales + inventory)
        if withdrawal == 'Withdrawal':
            transactions = transactions[transactions >= 0]
        if withdrawal == 'Deposit':
            transactions = transactions[transactions <= 0]
        transactions = sorted(transactions, key=lambda k: time.mktime(time.strptime(k['date'], DATE_FORMAT)),
                              reverse=(order == 1))

    if type == 'Salary':
        transactions = np.array(salary)

        if withdrawal == 'Withdrawal':
            transactions = transactions[transactions >= 0]
        if withdrawal == 'Deposit':
            transactions = transactions[transactions <= 0]

    if type == 'Sales':
        transactions = np.array(sales)
        if withdrawal == 'Withdrawal':
            transactions = transactions[transactions >= 0]
        if withdrawal == 'Deposit':
            transactions = transactions[transactions <= 0]

    if type == "Inventory":
        transactions = np.array(inventory)
        if withdrawal == 'Withdrawal':
            transactions = transactions[transactions >= 0]
        if withdrawal == 'Deposit':
            transactions = transactions[transactions <= 0]

    if type == "Tax":
        transactions = np.array(taxes)
        if withdrawal == 'Withdrawal':
            transactions = transactions[transactions >= 0]
        if withdrawal == 'Deposit':
            transactions = transactions[transactions <= 0]
    return json.dumps(list(transactions))


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
    info = {
        'accounts': accounts,
        'inventorytransactions': inventoryTransactions,
        'salarytransactions': salaryTransactions,
        'salestransactions': salesTransactions,
        'taxtransactions': taxTransactions
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


def get_department_spending():
    db = get_db()
    transactions = []

    table = db['salarytransactions']
    tsalary = {'Salary': 0}
    for i in table.all():
        amount = float(i['posttaxamount'] - i['taxamount']) * -1
        if amount < 0:
            tsalary['Salary'] += (amount * -1)
    transactions.append(tsalary)

    table = db['salestransactions']
    tsales = {'Sales': 0}
    for i in table.all():
        amount = float(i['posttaxamount'] - i['taxamount']) * (
            -1 if i['transactiontype'] == 'withdrawal' else 1)
        if amount < 0:
            tsales['Sales'] += (amount * -1)
    transactions.append(tsales)

    table = db['inventorytransactions']
    tinventory = {'Inventory': 0}
    for i in table.all():
        amount = float(i['posttaxamount'] - i['taxamount']) * -1
        if amount < 0:
            tinventory['Inventory'] += (amount * -1)
    transactions.append(tinventory)

    return json.dumps(transactions)


def add_id_and_account_to_payload(payload, pk):
    payload['transactionid'] = pk
    if 'accountid' not in payload.keys():
        payload['accountid'] = MAIN_ACCOUNT_ID


def get_bal_history(account=1):
    now = datetime.datetime.now()
    yr = now.year
    month = now.month
    p_yr = now.year - 1
    p_month = month
    dates = [(a % 12 + 1, a / 12) for a in range(12 * yr + month - 1, 12 * p_yr + p_month - 2, -1)]
    db = get_db()
    table = db['salarytransactions']
    transactions = []
    if account != 2:
        for i in table.all():
            if i['accountid'] == account:
                t = {}
                t['date'] = i['date']
                t['amount'] = float(i['posttaxamount'] - i['taxamount']) * -1
                t['account'] = i['accountid']
                transactions.append(t)
        table = db['salestransactions']
        for i in table.all():
            if i['accountid'] == account:
                t = {}
                t['date'] = i['date']
                t['amount'] = float(i['posttaxamount'] - i['taxamount']) * (
                    -1 if i['transactiontype'] == 'withdrawal' else 1)
                t['account'] = i['accountid']
                transactions.append(t)
        table = db['inventorytransactions']
        for i in table.all():
            if i['accountid'] == account:
                t = {}
                t['date'] = i['date']
                t['amount'] = float(i['posttaxamount'] - i['taxamount']) * -1
                t['account'] = i['accountid']
                transactions.append(t)
        table = db['inventorytransactions']
        for i in table.all():
            if i['accountid'] == account:
                t = {}
                t['date'] = i['date']
                t['amount'] = float(i['posttaxamount'] - i['taxamount']) * -1
                t['account'] = i['accountid']
                transactions.append(t)
    else:
        table = db['taxtransactions']
        for i in table.all():
            t = {}
            t['date'] = i['date']
            t['amount'] = float(i['amount'])
            transactions.append(t)
        table = db['taxpayments']
        for i in table.all():
            t = {}
            t['date'] = i['date']
            t['amount'] = float(i['amount']) * -1
            transactions.append(t)
    transactions = sorted(transactions, key=lambda k: time.mktime(time.strptime(k['date'], DATE_FORMAT)))
    balance = 10e6 if account == 1 else 0
    for i in range(len(transactions)):
        balance += transactions[i]['amount']
        transactions[i]['bal'] = balance

    response = []
    tr_pointer = 0
    if account == 1:
        cur_bal = 10e6
    else:
        cur_bal = 0
    dates.reverse()
    for i in range(len(dates)):
        data = {}
        if len(transactions) > tr_pointer:
            tr_time = time.mktime(time.strptime(transactions[tr_pointer]['date'], DATE_FORMAT))
        else:
            tr_time = -1
        temp = dates[i]
        mnth = dates[i][0] + 1
        yr = dates[i][1]
        if mnth > 12:
            mnth = 1
            yr += 1
        dt = str(mnth) + "/" + str(yr)
        if len(dt) < 7:
            dt = "0" + dt
        data['date'] = str(dates[i][0]) + "/" + str(dates[i][1])
        dt_time = time.mktime(time.strptime(dt, "%m/%Y"))
        if tr_time > dt_time:
            data['balance'] = cur_bal
        else:
            while tr_pointer < len(transactions) and dt_time > tr_time:
                cur_bal = transactions[tr_pointer]['bal']
                tr_time = time.mktime(time.strptime(transactions[tr_pointer]['date'], DATE_FORMAT))
                tr_pointer += 1
            data['balance'] = cur_bal
        response.append(data)
    return json.dumps(response)


"""
Helper function to get all
records from a table in a list
"""


def get_all_from_table(table):
    records = []
    for i in table:
        records.append(i)
    return records
