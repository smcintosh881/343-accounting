import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import BalanceBox from '../components/dash/BalanceBox';
import MainChart from '../components/dash/MainChart';
import PiChart from '../components/dash/PiChart';
import RecentTransactions from '../components/dash/RecentTransactions'
import {fetchBalanceInitial, fetchTransactionsInitial, payTaxesAction, fetchSpending} from '../actions/index'
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
        dispatch(fetchSpending());
        dispatch(fetchTransactionsInitial());
    }

    payTaxes() {
        const {dispatch} = this.props;
        dispatch(payTaxesAction({amount: this.props.accountBalance.taxes}));
    }

    render() {
        const accounts = this.props.accountBalance;
        const history = this.props.history;
        const departmentSpending = this.props.departmentSpending;

        return (
            <Segment attached='bottom'>
                <Grid>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column style={{"marginLeft": "40px"}} width={11}>
                            <MainChart />
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Grid.Row>
                                <BalanceBox payTaxes={this.payTaxes} balances={accounts}
                                            header="Taxes Owed"/>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width={1}/>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={6} style={{"marginLeft": "40px"}}>
                            <PiChart department={departmentSpending.department} spending={departmentSpending.spending}/>
                        </Grid.Column>
                        <Grid.Column width={9}>
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
    history: PropTypes.array,
    departmentSpending: PropTypes.array,
};

function mapStateToProps(state) {
    return {
        accountBalance: state.accountBalance,
        history: state.transactions.history,
        departmentSpending: state.departmentSpending
    };
}

export default connect(mapStateToProps)(Dashboard)