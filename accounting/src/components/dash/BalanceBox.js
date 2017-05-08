import {Component, PropTypes} from 'react';
import {Segment, Header, Grid, Divider, Form, Checkbox, Button, Input} from 'semantic-ui-react';
import PayTaxButton from './PayTaxButton';
import {payTaxesAction} from '../../actions/index';

export default class BalanceBox extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            amount: null,
        });
    }

    handleInputChange = (event, data) => {
        this.setState({
            amount: data.value
        });
    };

    handleChecked = (event, data) => {
        let payment = 0.0;
        if (data.checked) {
            payment = this.props.balances.taxes;
        }
        this.setState({
            amount: payment
        });
    };

    clickEventHandler = (e) => {
        this.props.handlePayTaxes(this.state.amount);
    };

    render() {
        return (
            <div>
                <Header as='h3' textAlign='center' attached='top' block>
                    Overview
                </Header>
                <Segment color='teal' attached padded={true} textAlign='left' compact>
                    <Grid.Row>
                        <Header as='h4'>Current Balance:</Header>
                        ${this.props.balances.balance}
                    </Grid.Row>
                    <Divider section/>
                    <Grid.Row>
                        <Header as='h4'>Taxes Owed: </Header>
                        ${this.props.balances.taxes}
                    </Grid.Row>
                    <Divider section/>
                    <Grid.Row>
                        <Header as='h4'>Make Payment:</Header>
                        Amount:
                        <Grid.Row>
                            <Input onChange={this.handleInputChange} value={this.state.amount}
                                   placeholder={'$' + this.props.balances.taxes}/>
                        </Grid.Row>
                        <div style={{"marginTop": "15px"}}/>

                        <Checkbox onChange={this.handleChecked} label='Full Payment'/>
                        <div style={{"marginTop": "15px"}}/>
                        <Grid.Row>
                            <Button onClick={this.clickEventHandler} color='teal'>Submit</Button>
                        </Grid.Row>
                    </Grid.Row>
                </Segment>
            </div>
        );
    }
}

BalanceBox.propTypes = {
    balances: PropTypes.object,
    handlePayTaxes: PropTypes.func,
};