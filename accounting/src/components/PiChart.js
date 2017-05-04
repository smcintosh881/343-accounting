import {Component} from 'react';
import {Segment, Header} from 'semantic-ui-react';

export default class PiChart extends Component {
    constructor(props) {
        super(props);
        this.setState = {
            amount: 0
        };
    }

    render() {
        return (
            <div>
                <Header as='h3' textAlign='center' attached='top' block>
                    Department Spending
                </Header>
                <Segment attached textAlign='center'>
                    <img src="https://i.stack.imgur.com/RAU1A.png"/>
                </Segment>
            </div>
        );
    }
}