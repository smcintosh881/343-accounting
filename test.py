import requests
import unittest
from databaseWrapper import get_db
import subprocess
import time


class ServerTester(unittest.TestCase):
    db = get_db()
    salaryTable = db['SalaryTransactions']
    saleTable = db['SalesTransactions']
    inventoryTable = db['InventoryTransactions']
    accountsTable = db['Accounts']
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

        entry = self.salaryTable.find_one(userId = userId)
        self.assertEqual(entry['postTaxAmount'] - entry['taxAmount'], amount)
        self.assertEqual(entry['department'], department)
        self.assertEqual(entry['userId'], userId)
        self.assertEqual(self.salaryTable.count(), 1)
        balance = self.accountsTable.find_one(id = 1)['balance']
        self.assertEqual(entry['postTaxAmount'] - entry['taxAmount'], self.startingBalance - balance)

    def test_saledeposit_table_updated(self):
        self.reset_database()
        preTaxAmount = 100.0
        taxAmount = 7.0
        transactionsType = "Deposit"
        salesId = 123

        s = requests.Session()
        data = "{{\"preTaxAmount\": {}, \"taxAmount\": {},\"transactionType\": \"{}\",\"salesID\": {}}}".format(
            preTaxAmount, taxAmount, transactionsType, salesId)
        r = s.post("http://127.0.0.1:5000/sale", data=data)

        entry = self.saleTable.find_one(salesId = salesId)
        self.assertEqual(entry['postTaxAmount'], preTaxAmount + taxAmount)
        self.assertEqual(entry['taxAmount'], taxAmount)
        self.assertEqual(entry['transactionType'], transactionsType.lower())
        self.assertEqual(entry['salesId'], salesId)
        balance = self.accountsTable.find_one(id=1)['balance']
        self.assertEqual(self.startingBalance + (entry['postTaxAmount'] - entry['taxAmount']), balance)

    def test_salewithdrawal_table_updated(self):
        self.reset_database()
        preTaxAmount = 47356.21
        taxAmount = 73.91
        transactionsType = "withdrawal"
        salesId = 321

        s = requests.Session()
        data = "{{\"preTaxAmount\": {}, \"taxAmount\": {},\"transactionType\": \"{}\",\"salesID\": {}}}".format(
            preTaxAmount, taxAmount, transactionsType, salesId)
        s.post("http://127.0.0.1:5000/sale", data=data)

        entry = self.saleTable.find_one(salesId = salesId)
        self.assertEqual(entry['postTaxAmount'], preTaxAmount + taxAmount)
        self.assertEqual(entry['taxAmount'], taxAmount)
        self.assertEqual(entry['transactionType'], transactionsType.lower())
        self.assertEqual(entry['salesId'], salesId)
        balance = self.accountsTable.find_one(id=1)['balance']
        self.assertEqual(self.startingBalance - entry['postTaxAmount'], balance)

    def test_inventory_table_updated(self):
        self.reset_database()
        amount = 214544.12

        s = requests.Session()
        data = "{{\"amount\": {}}}".format(amount)
        s.post("http://127.0.0.1:5000/inventory", data=data)

        entry = self.inventoryTable.find_one(transactionId = 0)
        self.assertEqual(entry['postTaxAmount'] - entry['taxAmount'], amount)
        balance = self.accountsTable.find_one(id=1)['balance']
        self.assertEqual(self.startingBalance - (entry['postTaxAmount'] - entry['taxAmount']), balance)

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
        entry = self.saleTable.find_one(salesId=salesId)
        self.assertIsNone(entry)
        balance = self.accountsTable.find_one(id=1)['balance']
        self.assertEqual(balance, self.startingBalance)

        transactionsType = "deposit"
        data2 = "{{\"preTaxAmount\": {}, \"taxAmount\": {},\"transactionType\": \"{}\",\"salesID\": {}}}".format(
            preTaxAmount, taxAmount, transactionsType, salesId)
        response2 = s.post("http://127.0.0.1:5000/sale", data=data2)

        self.assertEqual(response2.status_code, 200)

def main():
    unittest.main()

if __name__ == '__main__':
    main()
