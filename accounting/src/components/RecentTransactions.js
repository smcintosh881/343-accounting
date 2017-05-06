import {Component, PropTypes} from 'react';
import {Table, Segment, Header} from 'semantic-ui-react';
import Transaction from '../components/Transaction';
import _ from 'lodash';


export default class RecentTransactions extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        column: 'Date',
        direction: 'ascending',
    };

    handleSort = clickedColumn => () => {
        const {column, data, direction} = this.state;

        this.setState({
            column: clickedColumn,
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    };

    render() {
        const {column, data, direction} = this.state;
        return (
            <div>
                <Header as='h3' textAlign='center' attached='top' block>
                    Recent Activity
                </Header>
                <Segment attached textAlign='center' compact>
                    <Table sortable selectable color={this.props.color}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell sorted={column === 'Date' && direction}
                                                  onClick={this.handleSort('Date')}>
                                    Date
                                </Table.HeaderCell>
                                <Table.HeaderCell sorted={column === 'Account' && direction}
                                                  onClick={this.handleSort('Account')}>
                                    Account
                                </Table.HeaderCell>
                                <Table.HeaderCell sorted={column === 'Type' && direction}
                                                  onClick={this.handleSort('Type')}>
                                    Transaction Type
                                </Table.HeaderCell>
                                <Table.HeaderCell sorted={column === 'Amount' && direction}
                                                  onClick={this.handleSort('Amount')}>
                                    Amount
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.direction === "ascending" ? (
                                    _.sortBy(this.props.history, [this.state.column]).map(transaction => {
                                        return (<Transaction key={transaction.amount} transaction={transaction}/>)
                                    }) ) : (
                                    _.sortBy(this.props.history, [this.state.column]).reverse().map(transaction => {
                                            return (<Transaction key={transaction.amount} transaction={transaction}/>)
                                        }
                                    )
                                )
                            }
                        </Table.Body>
                    </Table>
                </Segment>
            </div>
        )
    }
}

RecentTransactions.propTypes = {
    history: PropTypes.arrayOf(PropTypes.object),
};
