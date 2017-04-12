const initialState = {
        preTaxAmount : null,
        taxAmount : null,
        transactionType : '',
        salesID : null
};

class SaleForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = initialState;
    }
    handleChange(event) {
        this.setState({[event.target.name]: isNaN(event.target.value) ? event.target.value : Number(event.target.value)});
    }
    handleSubmit(event) {
        event.preventDefault();
        fetch('/sale', {
            method : 'POST',
            body : JSON.stringify(this.state)
        });
        this.setState(initialState);
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Pre Tax Amount<br/>
                    <input name="preTaxAmount" title="preTaxAmount" type="number" step="0.01" min=".01" onChange={this.handleChange} value={this.state.preTaxAmount} /><br/>
                </label>
                <label>
                    Tax Amount<br/>
                    <input name="taxAmount" title="taxAmount" type="number" step="0.01" min=".01" onChange={this.handleChange} value={this.state.taxAmount} /><br/>
                </label>
                <label>
                    Transaction Type<br/>
                    <select name="transactionType" title="transactionType" onChange={this.handleChange} value={this.state.transactionType} >
                        <option disabled selected value=''></option>
                        <option value="withdrawal">Withdrawal</option>
                        <option value="deposit">Deposit</option>
                    </select><br/>
                </label>
                <label>
                    Sale ID<br/>
                    <input name="salesID" title="salesID" type="number" min="1" onChange={this.handleChange} value={this.state.salesID} /><br/>
                </label>
                <input type="submit" value="submit"/>
            </form>
        )
    }
}

ReactDOM.render(
    React.createElement(SaleForm),
    document.getElementById('content')
);