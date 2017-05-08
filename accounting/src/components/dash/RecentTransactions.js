import {Component, PropTypes} from 'react';
import {Table, Segment, Header} from 'semantic-ui-react';
import Transaction from '../Transaction';
import _ from 'lodash';


export default class RecentTransactions extends Component {
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
            <div>
                <Header as='h3' textAlign='center' attached='top' block>
                    Recent Activity
                </Header>
                <Segment attached textAlign='center' compact>
                    <Table sortable celled selectable color={this.props.color}>
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
                                <Table.HeaderCell textAlign='right' sorted={column === 'amount' && direction}
                                                  onClick={this.handleSort('amount')}>
                                    Amount
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.direction === "ascending" ? (
                                    _.sortBy(this.props.history, [this.state.column]).map(transaction => {
                                        return (<Transaction all={false} key={transaction.amount} transaction={transaction}/>)
                                    }) ) : (
                                    _.sortBy(this.props.history, [this.state.column]).reverse().map(transaction => {
                                            return (<Transaction all={false} key={transaction.amount} transaction={transaction}/>)
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
    history: PropTypes.object,
};
