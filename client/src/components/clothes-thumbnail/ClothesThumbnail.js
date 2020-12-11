import React, { PureComponent, Component } from 'react';
import "./style.css";
import axios from 'axios';
import {Pie} from 'react-chartjs-2';

class ClothesThumbnail extends PureComponent {

  state = {
    clothesData: [],
    chartData: {
      labels: [
        'jumper',
        'hoodie',
        'jacket',
        'sweater',
        'blazer',
        'raincoat'
      ],
      datasets: [
        {
          label: 'Clothes',
          backgroundColor: [
            'rgba(255, 99, 132, 0.75)', 
            'rgba(54, 162, 235, 0.75)',
            'rgba(255, 206, 86, 0.75)',
            'rgba(75, 192, 192, 0.75)',
            'rgba(153, 102, 255, 0.75)',
            'rgba(132, 68, 98, 0.75)'
          ],
          data: []
        },
      ]
    },
  }

  setPieChartData = () => {
    let clothesFreq = {};
    // Retrieve occurences of each type of clothing
    this.state.clothesData.forEach((obj) => {
      if (clothesFreq.hasOwnProperty(obj.clothe)) {
        clothesFreq[obj.clothe] += 1;
      } else {
        clothesFreq[obj.clothe] = 1;
      }
    });
    this.setState({
      clothesFreq
    });
    // Assign data to chartData dataset
    // Loop through object and extract values for data array
    for (let obj in this.state.clothesFreq) {
      this.state.chartData.datasets[0].data.push(this.state.clothesFreq[obj]);
    }
    // update pie chart ui
    try {
      let piechart = this.reference.chartInstance;
      piechart.update();
    } catch (err) {
      console.log(err);
    }
  }

  async componentDidMount() {
    const token = localStorage.getItem('token');
    const headerConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `${token}`
      }
    }
    // Retrieve clothes data from API
    try {
      const res = await axios.get('/api/clothes', headerConfig);
      this.setState({
        clothesData: res.data
      })
    } catch (err) {
      console.log(err);
    }
    // Retrieve clothes data for the pie chart
    this.setPieChartData();
  }

  render() {
    return (
      <div className="clothes-thumbnail-item">
        <div className="clothes-thumbnail-header">
          <h1 className="">Clothes</h1>
        </div>
        <div className="clothes-thumbnail-pie" style={{marginTop: "10px"}}>
          <Pie 
            ref={(reference => this.reference = reference)}
            data={this.state.chartData}
            redraw={true}
            shouldComponentUpdate={true}
            width={100}
            height={50}
            options={
              { maintainAspectRatio: true,
                responsive: true
              }}/>
        </div>
      </div>
    )
  }
}

export default ClothesThumbnail;