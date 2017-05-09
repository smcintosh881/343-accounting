import requests
import unittest
from accounting.databaseWrapper import get_db
import subprocess
import time


class ServerTester(unittest.TestCase):
    db = get_db()
    salaryTable = db['salarytransactions']
    saleTable = db['salestransactions']
    inventoryTable = db['inventorytransactions']
    accountsTable = db['accounts']
    startingBalance = 1000000.0

    def reset_database(self):
        self.salaryTable.delete()
        self.saleTable.delete()
        self.inventoryTable.delete()
        self.accountsTable.delete()
        accountData = dict(id = 1, name = 'main', balance = self.startingBalance)
        tax = dict(id = 2, name = 'tax', balance = 0)
        self.accountsTable.insert(accountData)
        self.accountsTable.insert(tax)

    def test_salary_table_updated(self):
        self.reset_database()
        amount = 350.00
        department = 'Accounting'
        userId = 789
        name = 'Joe Doe'

        s = requests.Session()
        data = "{{\"amount\": {},\"department\": \"{}\",\"userID\": {},\"name\": \"{}\"}}".format(amount, department, userId, name)
        s.post("http://127.0.0.1:5000/salary",data=data)
        entry = self.salaryTable.find_one(userid = userId)
        self.assertEqual(entry['posttaxamount'] - entry['taxamount'], amount)
        self.assertEqual(entry['department'], department)
        self.assertEqual(entry['userid'], userId)
        self.assertEqual(self.salaryTable.count(), 1)
        balance = self.accountsTable.find_one(id = 1)['balance']
        self.assertEqual(entry['posttaxamount'] - entry['taxamount'], self.startingBalance - float(balance))

    def test_saledeposit_table_updated(self):
        self.reset_database()
        preTaxAmount = 100.0
        taxAmount = 7.0
        transactionsType = "deposit"
        salesId = 123

        s = requests.Session()
        data = "{{\"preTaxAmount\": {}, \"taxAmount\": {},\"transactionType\": \"{}\",\"salesID\": {}}}".format(
            preTaxAmount, taxAmount, transactionsType, salesId)
        r = s.post("http://127.0.0.1:5000/sale", data=data)

        entry = self.saleTable.find_one(salesid = salesId)
        self.assertEqual(entry['posttaxamount'], preTaxAmount + taxAmount)
        self.assertEqual(entry['taxamount'], taxAmount)
        self.assertEqual(entry['transactiontype'], transactionsType)
        self.assertEqual(entry['salesid'], salesId)
        balance = self.accountsTable.find_one(id=1)['balance']
        self.assertEqual(self.startingBalance + float(entry['posttaxamount']), balance)
        taxBalance = self.accountsTable.find_one(id=2)['balance']


    def test_salewithdrawal_table_updated(self):
        self.reset_database()
        preTaxAmount = 47356.21
        taxAmount = 73.91
        transactionsType = "withdrawal"
        salesId = 321

        s = requests.Session()
        data = "{{\"preTaxAmount\": {}, \"taxAmount\": {},\"transactionType\": \"{}\",\"salesID\": {}}}".format(
            preTaxAmount, taxAmount, transactionsType, salesId)
        r = s.post("http://127.0.0.1:5000/sale", data=data)

        entry = self.saleTable.find_one(salesid = salesId)
        self.assertEqual(float(entry['posttaxamount']), preTaxAmount + taxAmount)
        self.assertEqual(float(entry['taxamount']), taxAmount)
        self.assertEqual(entry['transactiontype'], transactionsType)
        self.assertEqual(entry['salesid'], salesId)
        balance = self.accountsTable.find_one(id=1)['balance']
        self.assertEqual(self.startingBalance - float(entry['posttaxamount']), float(balance))

    def test_inventory_table_updated(self):
        self.reset_database()
        amount = 214544.12

        s = requests.Session()
        data = "{{\"amount\": {}}}".format(amount)
        s.post("http://127.0.0.1:5000/inventory", data=data)

        entry = self.inventoryTable.find_one(transactionid = 0)
        self.assertEqual(float(entry['posttaxamount'] - entry['taxamount']), amount)
        balance = self.accountsTable.find_one(id=1)['balance']
        self.assertEqual(self.startingBalance - float(entry['posttaxamount'] - entry['taxamount']), float(balance))

    def test_sales_invalid_transaction_type(self):
        self.reset_database()
        preTaxAmount = 1000.0
        taxAmount = 25.0
        transactionsType = "invalid"
        salesId = 987

        s = requests.Session()
        data = "{{\"preTaxAmount\": {}, \"taxAmount\": {},\"transactionType\": \"{}\",\"salesID\": {}}}".format(
            preTaxAmount, taxAmount, transactionsType, salesId)
        response = s.post("http://127.0.0.1:5000/sale", data=data)

        self.assertEqual(response.status_code, 400)
        entry = self.saleTable.find_one(salesid=salesId)
        self.assertIsNone(entry)
        balance = self.accountsTable.find_one(id=1)['balance']
        self.assertEqual(balance, self.startingBalance)

        transactionsType = "deposit"
        data2 = "{{\"preTaxAmount\": {}, \"taxAmount\": {},\"transactionType\": \"{}\",\"salesID\": {}}}".format(
            preTaxAmount, taxAmount, transactionsType, salesId)
        response2 = s.post("http://127.0.0.1:5000/sale", data=data2)

        self.assertEqual(response2.status_code, 200)

    def test_paytax_tabe_updated(self):
        self.reset_database()
        taxPayment = 314159.15
        startingTax = 535897.25
        data = dict(id=2, balance=startingTax)
        self.accountsTable.update(data, ['id'])

        s = requests.Session()
        data = "{{\"amount\": {}}}".format(taxPayment)
        s.post("http://127.0.0.1:5000/api/paytax", data=data)

        taxBalance = float(self.accountsTable.find_one(id=2)['balance'])
        self.assertEqual(taxBalance, round((startingTax - taxPayment), 2))
        accountBlance = float(self.accountsTable.find_one(id=1)['balance'])
        self.assertEqual(accountBlance, self.startingBalance - taxPayment)

    def test_paytax_invalid_amounts(self):
        self.reset_database()
        startingTax = 535897.25
        data = dict(id=2, balance=startingTax)
        self.accountsTable.update(data, ['id'])

        s = requests.Session()

        # pay more tax than we owe
        data = "{{\"amount\": {}}}".format(startingTax + 1)
        response = s.post("http://127.0.0.1:5000/api/paytax", data=data)
        self.assertEqual(response.status_code, 400)

        # invalid amount
        data = "{{\"amount\": {}}}".format('abc')
        response = s.post("http://127.0.0.1:5000/api/paytax", data=data)
        self.assertEqual(response.status_code, 400)

        # negative amount
        data = "{{\"amount\": {}}}".format(-1234)
        response = s.post("http://127.0.0.1:5000/api/paytax", data=data)
        self.assertEqual(response.status_code, 400)

        taxBalance = self.accountsTable.find_one(id=2)['balance']
        self.assertEqual(taxBalance, startingTax)
        accountBlance = self.accountsTable.find_one(id=1)['balance']
        self.assertEqual(accountBlance, self.startingBalance)

def main():
    unittest.main()

if __name__ == '__main__':
    main()
