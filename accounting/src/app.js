import {Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import Dashboard from './container/Dashboard';
import {Menu, Grid, Segment} from 'semantic-ui-react';
import configureStore from './configureStore.js'

const store = configureStore();


class Demo extends Component {
    state = {activeItem: 'Overview'};

    handleItemClick = (e, {name}) => this.setState({activeItem: name});

    render() {
        const {activeItem} = this.state;

        return (
            <Provider store={store}>
            <div>
                <Grid padded>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column>
                            <Menu attached='top' tabular>
                                <Menu.Item name='Overview' active={activeItem === 'Overview'}
                                           onClick={this.handleItemClick}/>
                                <Menu.Item name='History' active={activeItem === 'History'}
                                           onClick={this.handleItemClick}/>
                            </Menu>
                            <Dashboard />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
            </Provider>
        );
    }
}

ReactDOM.render(<Demo />, document.querySelector('#app'));
