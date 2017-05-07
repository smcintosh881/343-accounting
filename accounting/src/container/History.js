import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchTransactionsInitial} from '../actions/index'
import {Grid, Segment} from 'semantic-ui-react';
import AllTransactions from '../components/AllTransactions'
import HistoryMenu from '../components/HistoryMenu';

class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: {
                history: []
            },
            withdrawal: '',
            type: ''
        };

    }


    handleClick = (event, data) => {
        let withdrawal = this.state.withdrawal;
        let type = this.state.type;

        if (data.text === 'Withdrawal' || data.text === 'Deposit') {
            withdrawal = data.text
        }
        else {
            type = data.text;
        }

        this.setState({
            withdrawal: withdrawal,
            type: type
        });
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(fetchTransactionsInitial());
    }

    render() {
        const history = this.props.history;

        return (
            <Segment attached='bottom'>
                <Grid>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column style={{"marginLeft": "30px"}} width={2}>
                            <HistoryMenu />
                        </Grid.Column>
                        <Grid.Column width={1} />
                        <Grid.Column width={12}>
                            <AllTransactions recent={false} history={history}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
}

History.propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.array
};

function mapStateToProps(state) {
    return {
        history: state.transactions.history
    };
}

export default connect(mapStateToProps)(History)