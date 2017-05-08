import {Component, PropTypes} from 'react';
import {Segment, Header, Grid, Divider, Form, Checkbox, Button} from 'semantic-ui-react';
import PayTaxButton from './PayTaxButton';

export default class BalanceBox extends Component {
    constructor(props) {
        super(props);
        let state = ({
            amount: 0.00
        });
    }

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
                        <Form>
                            <Form.Field>
                                Amount:
                                <input placeholder={'$' + this.props.balances.taxes} />
                            </Form.Field>
                            <Form.Field>
                                <Checkbox label='Full Payment'/>
                            </Form.Field>
                            <Button color='teal' type='submit'>Submit</Button>
                        </Form>
                    </Grid.Row>
                </Segment>
            </div>
        );
    }
}

BalanceBox.propTypes = {
    balances: PropTypes.object,
    handlePayTax: PropTypes.func
};