import './App.css';
import React from 'react';
import Chart from 'react-apexcharts';


function Header(props) {
  return (
    <div id="monitoringHeader">
      Voltage Monitoring
    </div>
  );
}

function VoltageBox(props) {
  return (
    <div id="voltageBox">
      {props.value} V
    </div>
  );
}

function Graph(props) {
  const options = {
    chart: {
      id: 'apexchart-example',
      animations: {
        enabled: false
      }
    },
    xaxis: {
      categories: []
    }
  }
  return (
    <div id="voltageGraph">
      <Chart options={options} series={props.data} />
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ADCVal: 0,
      LastFiftyVals: [0]
    }
  }

  async componentDidMount() {
    try {
      setInterval(async () => {
        const res = await fetch('adc-backend.herokuapp.com/getData');
        const data = await res.json();
        console.log(data)
        var currentVal = data.voltage.toFixed(2);
        var nextVals = this.state.LastFiftyVals;
        if (nextVals.length >= 50) {
          nextVals.shift();
        }
        nextVals.push(currentVal);
        this.setState({
          ADCVal: currentVal,
          LastFiftyVals: nextVals
        })
      }, 10);
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const graphData = [{
      name: "Voltage",
      data: this.state.LastFiftyVals
    }]
    return (
      <div className="App">
        <Header />
        <VoltageBox value={this.state.ADCVal} />
        <Graph data={graphData} />
      </div>
    );
  }
}

export default App;
