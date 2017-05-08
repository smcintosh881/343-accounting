import {Component, PropTypes} from 'react';
import {Menu, Dropdown, Icon, Input} from 'semantic-ui-react';

export default class HistoryMenu extends Component {
    constructor(props) {
        super(props);
    }

    clickEventHandler = (event, data) => {
        let type;
        let transaction;
        if (data.name === 'Deposit' || data.name === 'Withdrawal') {
            type = data.name
        } else {
            transaction = data.name
        }
        this.setState({
            transaction: transaction,
            type: type
        });
        this.props.handleFilterTransactions(this.state);
    };


    render() {
        const {transaction, type} = this.state || {};
        return (
            <Menu style={{"width": "12rem"}} vertical>
                <Menu.Item>
                    <Menu.Header style={{"color": "#00B5AD"}}>Transaction Type</Menu.Header>
                    <Menu.Menu>
                        <Menu.Item name='Salary' active={transaction === 'salary'}
                                   onClick={this.clickEventHandler}/>
                        <Menu.Item name='Inventory' active={transaction === 'inventory'}
                                   onClick={this.clickEventHandler}/>
                        <Menu.Item name='Sales' active={transaction === 'sales'} onClick={this.clickEventHandler}/>
                    </Menu.Menu>
                </Menu.Item>
                <Menu.Item>
                    <Menu.Header style={{"color": "#00B5AD"}}>Type</Menu.Header>
                    <Menu.Menu>
                        <Menu.Item name='Deposit' active={type === 'deposit'} onClick={this.clickEventHandler}/>
                        <Menu.Item name='Withdrawal' active={type === 'withdrawal'} onClick={this.clickEventHandler}/>
                    </Menu.Menu>
                </Menu.Item>
            </Menu>
        )
    }
}

HistoryMenu.propTypes = {
    handleFilterTransactions: PropTypes.func
};


