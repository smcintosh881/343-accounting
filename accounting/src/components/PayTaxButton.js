import {Component, PropTypes} from 'react';
import {Button} from 'semantic-ui-react';
import {payTaxes} from '../actions/index';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

export default class PayTaxButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Button positive size="medium" style={{"marginTop": "10px"}} fluid onClick={this.props.handlePayTax}>
                Pay Tax {this.props.taxBalance}
            </Button>
        );
    }
}

PayTaxButton.propTypes = {
    dispatch: PropTypes.func,
    taxBalance: PropTypes.number,
    handlePayTax: PropTypes.func
};



