import { Component } from 'react';

export default class Inventory extends Component {
  constructor(props) {
    super(props);
    this.setState = {
        amount: null
    };
    this.addInventory = this.addInventory.bind(this);
  }

  handleChange(e) {
      this.setState({
         amount: e.target.value
      });
      console.log(e.target.value);
  }

  addInventory(e) {

  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
          <label>Amount<br/>
              <input name="amount" title="amount" type="number" step="0.01" min=".01" onChange={this.handleChange} value={this.state.amount} /><br/>
          </label>
          <input type="submit" value="submit"/>
      </form>
    );
  }
}