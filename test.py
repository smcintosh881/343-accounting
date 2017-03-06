import requests
s = requests.Session()
data = "{\"Amount\": 350.00,\"Department\": \"Sales\",\"UserID\": 1234,\"Name\": \"John Doe\"}"
s.post("http://127.0.0.1:5000/salary",data=data)
