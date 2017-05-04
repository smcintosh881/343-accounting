import {Component} from 'react';
import {Segment, Header} from 'semantic-ui-react';

export default class MainChart extends Component {
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
                    Balance Graph
                </Header>
                <Segment attached textAlign='center'>
                    <img src="https://changelog.com/wp-content/uploads/chartkick.png"/>
                </Segment>
            </div>
        );
    }
}