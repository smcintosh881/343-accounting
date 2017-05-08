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
                <Header as='h3' textAlign='center' attached='top' block>
                    Department Spending
                </Header>
                <Segment attached={true} textAlign='center'>
                    {JSON.stringify(this.props.departmentSpending)}
                    <Doughnut data={
                        {
                            labels: this.props.department,
                            datasets: [{
                                data: this.props.spending,
                                backgroundColor: [
                                    '#FF6384',
                                    '#36A2EB',
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