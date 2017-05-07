import {Component, PropTypes} from 'react';
import {Menu, Dropdown, Icon, Input} from 'semantic-ui-react';

export default class HistoryMenu extends Component {
    constructor(props) {
        super(props);
    }

    handleItemClick = (name) => this.setState({activeTransaction: name});


    render() {
        const {activeItem} = this.state || {};

        return (
            <Menu vertical>
                <Menu.Item>
                    <Menu.Header>Transaction Type</Menu.Header>
                    <Menu.Menu>
                        <Menu.Item name='Salary' active={activeTransaction === 'salary'}
                                   onClick={this.handleItemClick}/>
                        <Menu.Item  name='Inventory' active={activeTransaction === 'inventory'} onClick={this.handleItemClick}/>
                        <Menu.Item name='Sales' active={activeTransaction === 'sales'} onClick={this.handleItemClick}/>
                    </Menu.Menu>
                </Menu.Item>
                <Menu.Item>
                    <Menu.Header>Type</Menu.Header>
                    <Menu.Menu>
                        <Menu.Item name='Deposit' active={activeItemType === 'deposit'} onClick={this.handleItemClick}/>
                        <Menu.Item name='Withdrawal' active={activeItemType === 'withdrawal'} onClick={this.handleItemClick}/>
                    </Menu.Menu>
                </Menu.Item>
            </Menu>
        )
    }
}

HistoryMenu.propTypes = {};



