import {Component, PropTypes} from 'react';
import {Segment, Header} from 'semantic-ui-react';

export default class CurrentBalance extends Component {
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

CurrentBalance.propTypes = {
    balance: PropTypes.number,
    header: PropTypes.string
};