import {Component, PropTypes} from 'react';
import {Table} from 'semantic-ui-react';
import Moment from 'moment';

export default class Transaction extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const transaction = this.props.transaction;
        return (
            <Table.Row key={transaction.account} positive={transaction.positive} negative={transaction.negative}>
                {this.props.all ? (
                        <Table.Cell>{transaction.date}</Table.Cell>
                    ) : (
                        <Table.Cell>{Moment(transaction.date, "MMM DD YYYY HH:mm:ss:SSS").fromNow()}</Table.Cell>
                    )}
                <Table.Cell>{transaction.account}</Table.Cell>
                <Table.Cell>{transaction.transaction}</Table.Cell>
                <Table.Cell textAlign='right'>{transaction.amount}</Table.Cell>
            </Table.Row>
        );
    }
}

Transaction.propTypes = {
    transaction: PropTypes.object,
    all: PropTypes.bool
};
