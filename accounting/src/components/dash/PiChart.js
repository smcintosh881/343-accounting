import {Component, PropTypes} from 'react';
import {Segment, Header} from 'semantic-ui-react';
import {Doughnut} from 'react-chartjs-2';

export default class PiChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Header as='h3' textAlign='center' attached='top' color='teal' block>
                    Department Spending
                </Header>
                <Segment attached={true} textAlign='center'>
                    <Doughnut data={
                        {
                            labels: this.props.department,
                            datasets: [{
                                data: this.props.spending,
                                backgroundColor: [
                                    '#00b5ad',
                                    '#ff4a52',
                                    '#FFCE56'
                                ],
                            }]
                        }

                    }/>
                </Segment>
            </div>
        );
    }
}

PiChart.propTypes = {
    department: PropTypes.array,
    spending: PropTypes.array
};