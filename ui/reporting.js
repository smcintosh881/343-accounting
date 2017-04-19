var LineChart = window['react-chartjs'].Line;

var data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40],
            spanGaps: false,
        }
    ]
};

var options = {};
var transaction_history = null;

var n_steps = 10;

var xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function () {
  if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      transaction_history = JSON.parse(xmlHttp.responseText);
      var transactions = [];
      var i;
      var sales = transaction_history.salesTransactions;
      for(i=0; i<sales.length; i++){
          var item = {};
	  item['date'] = Date.parse(sales[i].date);
          var t_type = sales[i].transactionType
	  if (t_type == "deposit"){
	      item['amount'] = -1*(sales[i].postTaxAmount - sales[i].taxAmount);
	  } else{
              item['amount'] = (sales[i].postTaxAmount - sales[i].taxAmount);
          }
	  transactions.push(item);
      }
      var salary = transaction_history.salaryTransactions;
      for(i=0; i<salary.length; i++){
          var item = {};
	  item['date'] = Date.parse(salary[i].date);
	  item['amount'] = (salary[i].postTaxAmount - salary[i].taxAmount);
	  transactions.push(item);
      }
      var inventory = transaction_history.inventoryTransactions;
      for(i=0; i<inventory.length; i++){
          var item = {};
	  item['date'] = Date.parse(inventory[i].date);
	  item['amount'] = (inventory[i].postTaxAmount - inventory[i].taxAmount);
	  transactions.push(item);
      }
      var accounts = transaction_history.accounts;
      transactions.sort(function(a,b){
	return b.date-a.date;
	})
      for(i = 0; i< transactions.length; i++){
	  if (i == 0){
		transactions[i].balance = accounts[0].balance + transactions[i].amount;
	  }else{
                transactions[i].balance = transactions[i-1].balance + transactions[i].amount;
	  }
      }
      transactions.reverse();
      var y = [];
      var x = [];
      for( i = 0; i < transactions.length; i++){
          y.push(transactions[i].balance);
	  x.push(transactions[i].date);
      }
      //transactions.reverse();
      var splitAmount = (transactions[transactions.length-1].date - transactions[0].date)/n_steps;
      var temp_bucket = transactions[0];
      var buckets = [];
      for(i = 0; i<n_steps; i++){
          buckets.push(transactions[i].date+splitAmount);
      }
      var j = 0;
      x = [];
      y = [];
      for(i=0; i<buckets.length; i++){
	  var curVal = 0;
          while(transactions[j].date < buckets[i] && j < transactions.length){
		curVal = transactions[j].balance;
		j++;
	  }
	  if(curVal == 0){
		curVal = x[i-1];
	  }
	  x.push(curVal);
	  y.push((new Date(buckets[i])).toLocaleDateString());
      }
      data.labels = y;
      data.datasets[0].data = x;
      ReactDOM.render(
      React.createElement(MyComponent),
      document.getElementById('content')
      );
      
  }
};
xmlHttp.open("GET", '/reporting', true);
xmlHttp.send(null);

class MyComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <LineChart data={data} options={options} width="600" height="250" redraw/>;
    }
}



ReactDOM.render(
    React.createElement(MyComponent),
    document.getElementById('content')
);
