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

sendRequest('/reporting', 'GET', null, function (data) {
    console.log(data)
});

class ExampleChart extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <LineChart data={data} options={options} width="600" height="250" redraw/>;
    }
}

//PayTaxForm, used for paying off taxes

const payTaxFormInitialState = {
    amount : 0
};

class PayTaxForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = payTaxFormInitialState;
    }
    handleChange(event) {
        this.setState({[event.target.name]: isNaN(event.target.value) ? event.target.value : Number(event.target.value)});
    }
    handleSubmit(event) {
        event.preventDefault();
        sendRequest('/paytax', 'POST', {amount: this.state.amount}, null);
        this.setState(payTaxFormInitialState);
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Amount<br/>
                    <input name="amount" title="amount" type="number" value={this.state.amount} onChange={this.handleChange}/><br/>
                </label>
                <input type="submit" value="submit"/>
            </form>
        )
    }
}

ReactDOM.render(
    <div>
        <ExampleChart/>
        <PayTaxForm/>
    </div>,
    document.getElementById('content')
);
