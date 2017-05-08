import {Component, PropTypes} from 'react';
import {Table, Segment, Header} from 'semantic-ui-react';

export default class SortBody extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Table.Body>
                {this.props.data.map(transaction => {
                    return (<Transaction transaction={transaction}/>);
                })}
                {JSON.stringify(this.props.data)}
            </Table.Body>
        )
    }
}

SortBody.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
};
