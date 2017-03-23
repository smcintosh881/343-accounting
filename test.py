import requests
import unittest
import dataset
from server import salary, get_db


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
        self.accountsTable.insert(accountData)


    def test_salary_table_updated(self):
        self.reset_database()

        amount = 350.00
        department = 'Accounting'
        userId = 789
        name = 'Joe Doe'

        s = requests.Session()
        data = "{{\"Amount\": {},\"Department\": \"{}\",\"UserID\": {},\"Name\": \"{}\"}}".format(amount, department, userId, name)
        s.post("http://127.0.0.1:5000/salary",data=data)

        entry = self.salaryTable.find_one(userId = userId)
        self.assertEqual(entry['postTaxAmount'] - entry['taxAmount'], amount)
        self.assertEqual(entry['department'], department)
        self.assertEqual(entry['userId'], userId)
        self.assertEqual(self.salaryTable.count(), 1)
        balance = self.accountsTable.find_one(id = 1)['balance']
        self.assertEqual(entry['postTaxAmount'], self.startingBalance - balance)

    def test_saledeposit_table_updated(self):
        self.reset_database()

        preTaxAmount = 100.0
        taxAmount = 7.0
        transactionsType = "Deposit"
        salesId = 123

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
        self.assertEqual(self.startingBalance + entry['postTaxAmount'], balance)

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
        data = "{{\"Amount\": {}}}".format(amount)
        s.post("http://127.0.0.1:5000/inventory", data=data)

        entry = self.inventoryTable.find_one(transactionId = 0)
        print entry
        self.assertEqual(entry['postTaxAmount'] - entry['taxAmount'], amount)
        balance = self.accountsTable.find_one(id=1)['balance']
        self.assertEqual(self.startingBalance - entry['postTaxAmount'], balance)


def main():
    unittest.main()

if __name__ == '__main__':
    main()
