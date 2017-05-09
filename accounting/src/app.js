import {Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import Dashboard from './container/Dashboard';
import History from './container/History';
import queryString from 'query-string';

import {Menu, Grid, Segment} from 'semantic-ui-react';
import configureStore from './configureStore.js'

const store = configureStore();


class Demo extends Component {
    state = {activeItem: 'Overview'};

    handleItemClick = (e, {name}) => this.setState({activeItem: name});

    componentDidMount() {
        var params = queryString.parse(location.search);
        if (params && params.token) {
            fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({
                    token: params.token
                })
            })
        }
    }

    render() {
        const {activeItem} = this.state;

        return (
            <Provider store={store}>
                <div style={{"marginTop": "40px"}}>
                    <Grid padded>
                        <Grid.Row />
                        <Grid.Row>
                            <Grid.Column width={1}/>
                            <Grid.Column width={14}>
                                <Menu attached='top' tabular>
                                    <Menu.Item name='Overview' active={activeItem === 'Overview'}
                                               onClick={this.handleItemClick}/>
                                    <Menu.Item name='History' active={activeItem === 'History'}
                                               onClick={this.handleItemClick}/>
                                </Menu>
                                    {activeItem === 'Overview' ? (
                                        <Dashboard />
                                    ) : (
                                        <History />
                                    )}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </Provider>
        );
    }
}

ReactDOM.render(<Demo />, document.querySelector('#app'));
