/**
 * Created by shannon on 4/3/17.
 */
const initialState = {
    amount : null,
    department : null,
    userID : null,
    name : null
};

class SalaryForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = initialState;
    }
    handleChange(event) {
        this.setState({[event.target.name]: isNaN(event.target.value) ? event.target.value : Number(event.target.value)});
    }
    handleError() {
        this.state.forEach(key, function() {
            if (!key.value){
                this.setState({
                    error: "Please Fill Missing Criteria"
                });
                return false;
            } else {
                return true;
            }
        });
    }
    handleSubmit(event) {
        event.preventDefault();
        fetch('/salary', {
            method : 'POST',
            body : JSON.stringify(this.state)
        });
        this.setState(initialState);
    }

    render() {
        return (
            <div>
            <form onSubmit={this.handleSubmit}>
                <label>Amount:</label><br/>
                <input name="amount" title="amount" type="number" onChange={this.handleChange} value={this.state.amount} /><br/>
                <label>Department:</label><br/>
                <select name="department" title="department" onChange={this.handleChange} value={this.state.department}><br/>
                    <option value="" disabled selected hidden></option>
                    <option value="Sales">Sales</option>
                    <option value="Accounting">Accounting</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Manufacturing">Manufacturing</option>
                </select><br/>
                <label>User Id:</label><br/>
                <input name="userID" title="userID" type="number" onChange={this.handleChange} value={this.state.userID} /><br/>
                <label>Name:</label><br/>
                <input name="name" title="name" type="text" onChange={this.handleChange} value={this.state.name} /><br/>
                <input type="submit" value="submit" />
            </form>
            </div>
        )
    }
}

React.render(
    React.createElement(SalaryForm),
    document.getElementById('content')
);