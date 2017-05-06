import {Component, PropTypes} from 'react';
import {Table, Segment, Header} from 'semantic-ui-react';
import Transaction from '../components/Transaction';

export default class AllTransactions extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Table sortable selectable color={this.props.color}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                        <Table.HeaderCell>Account</Table.HeaderCell>
                        <Table.HeaderCell>Transaction Type</Table.HeaderCell>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.props.history.map(transaction => {
                        return (<Transaction transaction={transaction}/>);
                    })
                    }
                </Table.Body>
            </Table>
        )
    }
}

AllTransactions.propTypes = {
    history: PropTypes.arrayOf(PropTypes.object),
};