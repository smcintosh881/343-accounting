import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchTransactionsInitial} from '../actions/index'
import {Grid, Segment, Menu, Dropdown, Icon, Input} from 'semantic-ui-react';
import AllTransactions from '../components/AllTransactions'

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

    temp() {
        fetchTransactionsInitial({
            withdrawal: this.state.withdrawal,
            type: this.state.type
        })
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
        const tagOptions = ['Inventory', 'Sales', 'Salary'];
        return (
            <Segment attached='bottom'>
                <Grid>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column width={1} />
                        <Grid.Column width={14}>
                            <Menu attached='top'>
                                <Dropdown item icon='filter' simple>
                                    <Dropdown.Menu>
                                        <Dropdown.Header>Transaction</Dropdown.Header>
                                        {['Inventory', 'Sales', 'Salary'].map((option) =>
                                            <Dropdown.Item key={option} text={option}
                                                           onClick={this.handleClick}/>)}
                                        <Dropdown.Divider />
                                        <Dropdown.Header>Type</Dropdown.Header>
                                        {['Withdrawal', 'Deposit'].map((option) =>
                                            <Dropdown.Item key={option} text={option}
                                                           onClick={this.handleClick}/>)}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Menu>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={1}/>
                                    <Grid.Column width={16}>
                                        <AllTransactions recent={false} history={history}/>
                                    </Grid.Column>
                                    <Grid.Column width={1}/>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                        <Grid.Column width={1}/>
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