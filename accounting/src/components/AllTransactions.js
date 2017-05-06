import {Component, PropTypes} from 'react';
import {Table, Segment, Header} from 'semantic-ui-react';
import Transaction from '../components/Transaction';
import _ from 'lodash';

export default class AllTransactions extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        column: 'date',
        direction: null,
    };

    handleSort = clickedColumn => () => {
        const {direction} = this.state;

        this.setState({
            column: clickedColumn,
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    };

    render() {
        const {column, direction} = this.state;

        return (
            <Table sortable selectable color={this.props.color}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell sorted={column === 'date' && direction}
                                          onClick={this.handleSort('date')}>
                            Date
                        </Table.HeaderCell>
                        <Table.HeaderCell sorted={column === 'account' && direction}
                                          onClick={this.handleSort('account')}>
                            Account
                        </Table.HeaderCell>
                        <Table.HeaderCell sorted={column === 'transaction' && direction}
                                          onClick={this.handleSort('transaction')}>
                            Transaction Type
                        </Table.HeaderCell>
                        <Table.HeaderCell sorted={column === 'amount' && direction}
                                          onClick={this.handleSort('amount')}>
                            Amount
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
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
                </Table.Body>
            </Table>
        )
    }
}

AllTransactions.propTypes = {
    history: PropTypes.arrayOf(PropTypes.object),
};

