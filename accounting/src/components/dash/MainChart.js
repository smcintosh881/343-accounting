import {Component} from 'react';
import {Segment, Header} from 'semantic-ui-react';
import {Line} from 'react-chartjs-2';

export default class MainChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Header as='h3' textAlign='center' attached='top' block>
                    Balance Graph
                </Header>
                <Segment attached={true} textAlign='center'>
                    <Line data={
                        {
                            labels: ['November','December','January', 'February', 'March', 'April', 'May'],
                            datasets: [
                                {
                                    label: 'Account Balance',
                                    fill: false,
                                    lineTension: 0.1,
                                    backgroundColor: 'rgba(75,192,192,0.4)',
                                    borderColor: 'rgba(75,192,192,1)',
                                    borderCapStyle: 'butt',
                                    borderDash: [],
                                    borderDashOffset: 0.0,
                                    borderJoinStyle: 'miter',
                                    pointBorderColor: 'rgba(75,192,192,1)',
                                    pointBackgroundColor: '#fff',
                                    pointBorderWidth: 1,
                                    pointHoverRadius: 5,
                                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                                    pointHoverBorderWidth: 2,
                                    pointRadius: 1,
                                    pointHitRadius: 10,
                                    data: [900000, 1000000, 1000000, 900000, 800000]
                                }
                            ]
                        }
                    }/>
                </Segment>
            </div>
        );
    }
}