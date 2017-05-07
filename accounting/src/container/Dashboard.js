import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import BalanceBox from '../components/BalanceBox';
import MainChart from '../components/MainChart';
import PiChart from '../components/PiChart';
import RecentTransactions from '../components/RecentTransactions'
import {fetchBalanceInitial, fetchTransactionsInitial, payTaxesAction} from '../actions/index'
import {Grid, Segment} from 'semantic-ui-react';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: {
                history: []
            }
        };
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(fetchBalanceInitial());
        dispatch(fetchTransactionsInitial());
    }

    handlePayTax() {
        const {dispatch} = this.props;
        dispatch(payTaxesAction({amount: this.props.accountBalance.taxes}));
    }

    render() {
        const accounts = this.props.accountBalance;
        const history = this.props.history;

        return (
            <Segment attached='bottom'>
                <Grid>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column style={{"marginLeft": "40px"}} width={15}>
                            <MainChart />
                        </Grid.Column>
                        <Grid.Column width={1}/>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={3} style={{"marginLeft": "40px"}}>
                            <Grid.Row>
                                <BalanceBox tax={false} balance={accounts.balance} header="Account Balance"/>
                            </Grid.Row>
                            <div style={{"marginTop": "30px"}}/>
                            <Grid.Row>
                                <BalanceBox payTaxes={this.handlePayTax} tax={true} balance={accounts.taxes}
                                            header="Tax Balance"/>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width={5}>
                            <PiChart />
                        </Grid.Column>
                        <Grid.Column width={7}>
                            <RecentTransactions recent={true} history={history.splice(0, 4)}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row />
                </Grid>
            </Segment>
        )
    }
}

Dashboard.propTypes = {
    dispatch: PropTypes.func.isRequired,
    accountBalance: PropTypes.object.isRequired,
    history: PropTypes.array
};

function mapStateToProps(state) {
    return {
        accountBalance: state.accountBalance,
        history: state.transactions.history
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        handlePayTax: (balance) => {
            dispatch(dispatch(payTaxesAction({amount: balance}))
            )
        }
    }
};

export default connect(mapStateToProps)(Dashboard)