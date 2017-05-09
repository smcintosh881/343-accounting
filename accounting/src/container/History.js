import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchTransactionsInitial, fetchFilterTransactions} from '../actions/index'
import {Grid, Segment, Button, Icon} from 'semantic-ui-react';
import AllTransactions from '../components/AllTransactions'
import HistoryMenu from '../components/HistoryMenu';

class History extends Component {
    constructor(props) {
        super(props);
        this.handleFilters = this.handleFilters.bind(this);
        this.state = {
            transactions: {
                history: []
            },
        };
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(fetchTransactionsInitial());
    }

    handleFilters(withdrawal, type) {
        const {dispatch} = this.props;
        dispatch(fetchFilterTransactions({type: type, withdrawal: withdrawal}));
    }

    render() {
        const transactions = this.props.transactions;

        return (
            <Segment attached='bottom'>
                <Grid>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column style={{"marginLeft": "30px"}} width={2}>
                            <HistoryMenu handleFilters={this.handleFilters}/>
                        </Grid.Column>
                        <Grid.Column width={1}/>
                        <Grid.Column width={12}>
                            <AllTransactions recent={false} transactions={transactions}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
}

History.propTypes = {
    dispatch: PropTypes.func.isRequired,
    transactions: PropTypes.array
};

function mapStateToProps(state) {
    return {
        transactions: state.transactions
    };
}

export default connect(mapStateToProps)(History)