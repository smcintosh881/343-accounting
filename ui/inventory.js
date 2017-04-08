const initialState = {
    amount : null
};

class InventoryForm extends React.Component {
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
        fetch('/inventory', {
            method : 'POST',
            body : JSON.stringify(this.state)
        });
        this.setState(initialState);
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Amount<br/>
                    <input name="amount" title="amount" type="number" step="0.01" min=".01" onChange={this.handleChange} value={this.state.amount} /><br/>
                </label>
                <input type="submit" value="submit"/>
            </form>
        )
    }
}

ReactDOM.render(
    React.createElement(InventoryForm),
    document.getElementById('content')
);
