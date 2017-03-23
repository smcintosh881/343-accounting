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
        department = '\"Accounting\"'
        userId = 789
        name = '\"Joe Doe\"'

        s = requests.Session()
        data = "{{\"Amount\": {},\"Department\": {},\"UserID\": {},\"Name\": {}}}".format(amount, department, userId, name)
        s.post("http://127.0.0.1:5000/salary",data=data)

        entry = self.salaryTable.find_one(userId = userId)
        self.assertEqual(entry['postTaxAmount'] - entry['taxAmount'], amount)
        self.assertEqual(entry['department'], department.strip('\"'))
        self.assertEqual(entry['userId'], userId)
        self.assertEqual(self.salaryTable.count(), 1)
        balance = self.accountsTable.find_one(id = 1)['balance']
        self.assertEqual(entry['postTaxAmount'], self.startingBalance - balance)

def main():
    unittest.main()

if __name__ == '__main__':
    main()
