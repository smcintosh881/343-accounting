import {Component, PropTypes} from 'react';
import {Table} from 'semantic-ui-react';

export default class Transaction extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const transaction = this.props.transaction;
        return (
            <Table.Row key={transaction.account} positive={transaction.positive} negative={transaction.negative}>
                <Table.Cell>{transaction.date}</Table.Cell>
                <Table.Cell>{transaction.account}</Table.Cell>
                <Table.Cell>{transaction.transaction}</Table.Cell>
                <Table.Cell>{transaction.amount}</Table.Cell>
            </Table.Row>
        );
    }
}

Transaction.propTypes = {
    transaction: PropTypes.object,
};
