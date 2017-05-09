import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import BalanceBox from '../components/dash/BalanceBox';
import MainChart from '../components/dash/MainChart';
import PiChart from '../components/dash/PiChart';
import LoginRequired from '../components/LoginRequired';
import RecentTransactions from '../components/dash/RecentTransactions'
import {
    fetchBalanceInitial,
    fetchTransactionsInitial,
    fetchUserLoggedIn,
    payTaxesAction,
    fetchSpending,
    accountBalanceGraph
} from '../actions/index'
import {Grid, Segment, Header} from 'semantic-ui-react';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.handlePayTaxes = this.handlePayTaxes.bind(this);

        this.state = {
            transactions: {
                history: []
            }
        };
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(fetchUserLoggedIn());
        dispatch(fetchBalanceInitial());
        dispatch(fetchSpending());
        dispatch(accountBalanceGraph());
        dispatch(fetchTransactionsInitial());
    }

    handlePayTaxes(amount) {
        const {dispatch} = this.props;
        dispatch(payTaxesAction({amount: amount}));
    }

    render() {
        const accounts = this.props.accountBalance;
        const transactions = this.props.transactions;
        const graph = this.props.graph;
        const userLoggedIn = this.props.userLoggedIn;

        return userLoggedIn ? (
            <Segment attached='bottom'>
                <Grid>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column style={{"marginLeft": "40px"}} width={11}>
                            <MainChart month={graph.month} balances={graph.balances}/>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Grid.Row>
                                <BalanceBox handlePayTaxes={this.handlePayTaxes} balances={accounts}/>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width={1}/>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={6} style={{"marginLeft": "40px"}}>
                            <PiChart department={graph.department} spending={graph.spending}/>
                        </Grid.Column>
                        <Grid.Column width={9}>
                            { Object.keys(transactions).length === 0 ? (
                                    <RecentTransactions recent={true} history={transactions}/>
                                ) : (
                                    <RecentTransactions recent={true} history={transactions.slice(0,4)}/>
                                )}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row />
                </Grid>
            </Segment>
        ) : <LoginRequired/>;
    }
}

Dashboard.propTypes = {
    userLoggedIn: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountBalance: PropTypes.object.isRequired,
    transactions: PropTypes.object,
    graph: PropTypes.object,

};

function mapStateToProps(state) {
    return {
        userLoggedIn: state.userLoggedIn,
        accountBalance: state.accountBalance,
        transactions: state.transactions,
        graph: state.graph
    };
}

export default connect(mapStateToProps)(Dashboard)