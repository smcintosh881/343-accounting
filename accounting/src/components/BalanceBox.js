import {Component, PropTypes} from 'react';
import {Segment, Header} from 'semantic-ui-react';

export default class BalanceBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Header as='h3' textAlign='center' attached='top' block>
                    {this.props.header}
                </Header>
                <Segment attached textAlign='center' compact>
                    ${this.props.balance}
                </Segment>
            </div>
        );
    }
}

BalanceBox.propTypes = {
    balance: PropTypes.number,
    header: PropTypes.string
};