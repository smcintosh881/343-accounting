import {Component, PropTypes} from 'react';
import {Segment, Header, Grid} from 'semantic-ui-react';
import PayTaxButton from './PayTaxButton';

export default class BalanceBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Header as='h3' textAlign='center' attached='top' block>
                    Overview
                </Header>
                <Segment attached textAlign='center' compact>
                    <Grid.Row>
                        ${this.props.balance}
                    </Grid.Row>
                    {this.props.tax ? (
                            <Grid.Row>
                                <PayTaxButton handlePayTax={() => this.props.handlePayTax()} taxBalance={this.props.balance}/>
                            </Grid.Row>
                        ) : (
                            <div></div>
                        )}
                </Segment>
            </div>
        );
    }
}

BalanceBox.propTypes = {
    balance: PropTypes.number,
    header: PropTypes.string,
    tax: PropTypes.bool,
    handlePayTax: PropTypes.func
};