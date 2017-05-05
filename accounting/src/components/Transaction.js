import {Component, PropTypes} from 'react';
import {Table} from 'semantic-ui-react';

export default class Transaction extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const transaction = this.props.transaction;
        return (
            <Table.Row>
                <Table.Cell>{JSON.stringify(transaction.account)}</Table.Cell>
                <Table.Cell>{JSON.stringify(transaction.date)}</Table.Cell>
                <Table.Cell>{JSON.stringify(transaction.transaction)}</Table.Cell>
                <Table.Cell>{JSON.stringify(transaction.amount)}</Table.Cell>
            </Table.Row>
        );
    }
}

Transaction.propTypes = {
    transaction: PropTypes.object,
};
