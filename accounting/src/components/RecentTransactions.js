import {Component, PropTypes} from 'react';
import {Table} from 'semantic-ui-react';
import Transaction from '../components/Transaction';

export default class RecentTransactions extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Table color={this.props.color}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Account</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Transaction</Table.HeaderCell>
                            <Table.HeaderCell>Amount</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.props.history.map(transaction => {
                            return (<Transaction transaction={transaction}/>)
                        })}
                    </Table.Body>
                </Table>
            </div>
        );
    }
}

RecentTransactions.propTypes = {
    history: PropTypes.arrayOf(PropTypes.object)
};
