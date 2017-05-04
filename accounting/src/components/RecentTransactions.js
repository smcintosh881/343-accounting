import {Component, PropTypes} from 'react';
import {Segment, Header} from 'semantic-ui-react';
import Transaction from '../components/Transaction';

export default class CurrentBalance extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Transaction color="green"/>
                <Transaction color="teal"/>
                <Transaction color="blue"/>
            </div>
        );
    }
}

CurrentBalance.propTypes = {
    balance: PropTypes.number,
    header: PropTypes.string
};
