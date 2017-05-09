import { Component } from 'react';
import { Header, Segment } from 'semantic-ui-react';

export default class LoginRequired extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Segment attached='bottom'>
                <Header>Access Denied</Header>
                <div>If you have a valid KrutzKorp account please <a href="http://vm343a.se.rit.edu/oauth">login here</a></div>
            </Segment>
        );
    }
}