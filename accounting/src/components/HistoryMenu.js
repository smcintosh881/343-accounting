import {Component, PropTypes} from 'react';
import {Menu, Dropdown, Icon, Input, Checkbox, Button} from 'semantic-ui-react';

export default class HistoryMenu extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        disabled: true
    };

    handleTransactionChange = (e, {value}) => {
        this.setState({transaction: value, disabled: false});
    };

    handleTypeChange = (e, {value}) => {
        this.setState({type: value, disabled: false});
    };

    clickEventHandler = (e) => {
        if (this.state.transaction && this.state.type) {
            this.props.handleFilters(this.state.transaction, this.state.type);
        }
        if (this.state.transaction && !this.state.type) {
            this.props.handleFilters(this.state.transaction);
        }
        if (!this.state.transaction && this.state.type) {
            this.props.handleFilters(this.state.type);
        }
    };

    resetState = (e) => {
        this.setState({
            transaction: null,
            type: null
        });
        this.props.handleFilters();
    };

    render() {
        const {transaction, type} = this.state || {};
        return (
            <div>
                <Menu style={{"width": "12rem"}} vertical>
                    <Menu.Item>
                        <Menu.Header style={{"color": "#00B5AD"}}>Transaction Type</Menu.Header>
                        <Menu.Menu>
                            <Menu.Item active={transaction === 'salary'}>
                                <Checkbox radio
                                          value='Salary'
                                          checked={this.state.transaction === 'Salary'}
                                          onChange={this.handleTransactionChange}
                                          label='Salary'/>
                            </Menu.Item>
                            <Menu.Item active={transaction === 'Inventory'}>
                                <Checkbox radio
                                          value='Inventory'
                                          checked={this.state.transaction === 'Inventory'}
                                          onChange={this.handleTransactionChange}
                                          label='Inventory'/>
                            </Menu.Item>
                            <Menu.Item active={transaction === 'Sales'}>
                                <Checkbox radio
                                          value='Sales'
                                          checked={this.state.transaction === 'Sales'}
                                          onChange={this.handleTransactionChange}
                                          label='Sales'/>
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header as='h2' style={{"color": "#00B5AD"}}>Type</Menu.Header>
                        <Menu.Menu>
                            <Menu.Item active={type === 'deposit'}>
                                <Checkbox radio
                                          value='Deposit'
                                          checked={this.state.type === 'Deposit'}
                                          onChange={this.handleTypeChange}
                                          label='Deposit'/>
                            </Menu.Item>
                            <Menu.Item active={type === 'Withdrawal'}>
                                <Checkbox radio
                                          value='Withdrawal'
                                          checked={this.state.type === 'Withdrawal'}
                                          onChange={this.handleTypeChange}
                                          label='Withdrawal'/>
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu.Item>
                </Menu>
                <Button.Group style={{"marginLeft": "42px"}}>
                    <Button icon='refresh' onClick={this.resetState}/>
                    <Button
                        disabled={this.state.disabled}
                        onClick={this.clickEventHandler}
                        content='Search'
                        color='teal'/>
                </Button.Group>

            </div>
        )
    }
}

HistoryMenu.propTypes = {
    handleFilters: PropTypes.func
};


