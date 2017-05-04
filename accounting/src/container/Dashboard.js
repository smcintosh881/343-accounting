import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import BalanceBox from '../components/BalanceBox';
import MainChart from '../components/MainChart';
import PiChart from '../components/PiChart';
import RecentTransactions from '../components/RecentTransactions'
import {fetchBalanceInitial, fetchTransactionsInitial} from '../actions/index'
import {Menu, Grid, Segment} from 'semantic-ui-react';

class Dashboard extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(fetchBalanceInitial());
        dispatch(fetchTransactionsInitial());
    }

    render() {
        const accounts = this.props.accountBalance;
        return (
            <Segment attached='bottom'>
                <Grid>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column width={1}/>
                        <Grid.Column width={14}>
                            <MainChart />
                        </Grid.Column>
                        <Grid.Column width={1}/>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={1}/>
                        <Grid.Column width={3}>
                            <Grid.Row>
                                <BalanceBox balance={accounts.balance} header="Account Balance"/>
                            </Grid.Row>
                            <Grid.Row divided={true}/>
                            <Grid.Row>
                                <BalanceBox balance={accounts.taxes} header="Tax Balance"/>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width={5}>
                            <PiChart />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={1}/>
                        <Grid.Column width={14}>
                            <RecentTransactions />
                        </Grid.Column>
                        <Grid.Column width={1}/>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
}

Dashboard.propTypes = {
    dispatch: PropTypes.func.isRequired,
    accountBalance: PropTypes.object
};

function mapStateToProps(state) {
    return {
        accountBalance: state.accountBalance,
    };
}

export default connect(mapStateToProps)(Dashboard)