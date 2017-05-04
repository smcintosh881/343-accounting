import {Component, PropTypes} from 'react';
import {Table, Header} from 'semantic-ui-react';

export default class CurrentBalance extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Table color={this.props.color} >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Food</Table.HeaderCell>
                            <Table.HeaderCell>Calories</Table.HeaderCell>
                            <Table.HeaderCell>Protein</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>Apples</Table.Cell>
                            <Table.Cell>200</Table.Cell>
                            <Table.Cell>0g</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Orange</Table.Cell>
                            <Table.Cell>310</Table.Cell>
                            <Table.Cell>0g</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>
        );
    }
}

CurrentBalance.propTypes = {
    color: PropTypes.string,
};
