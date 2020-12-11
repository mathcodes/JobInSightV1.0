import React, { Component } from 'react'
import "./style.css";
import logoRain from './assets/Rain_icon.png';
import logoCloud from './assets/Clouds_icon.png';
import logoSun from './assets/Sun_icon.png';
import axios from 'axios';

class WeatherThumbnail extends Component {

  state = {
    logo: "",
    temp: "",
    loc: ""
  }

  requestPosition() {
    // --- Stack overflow --- https://stackoverflow.com/questions/2707191/unable-to-cope-with-the-asynchronous-nature-of-navigator-geolocation
    // additionally supplying options for fine tuning, if you want to
    var options = {
      enableHighAccuracy: true,
      timeout:    5000,   // time in millis when error callback will be invoked
      maximumAge: 0,      // max cached age of gps data, also in millis
    };
  
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(
        pos => { resolve(pos); }, 
        err => { reject (err); }, 
        options);
    });
  }

  async componentDidMount () {
    // Make api call to weather api -- Should add below in another util function -- clean up
    const api_key = "d0a10211ea3d36b0a6423a104782130e";
    // get users current geo location
    const position = await this.requestPosition();
    const lon = position.coords.longitude;
    const lat = position.coords.latitude;
    // make call to openweather map api to get weather info
    try {
      const res = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`);
      if (res.status === 200) {
        // Set logo
        switch (res.data.weather[0].main) {
          case "Clouds":
            this.state.logo = logoCloud;
            break;
          case "Sun":
            this.state.logo = logoSun;
            break;
          case "Clear":
            this.state.logo = logoSun;
            break;
          case "Rain":
            this.state.logo = logoRain;
            break;
          default:
            break;
        }
        // set temp -- convert kelvin to celsius
        const celFromKel = Math.round(res.data.main.temp - 273.15);
        this.state.temp = celFromKel;
        // set city
        this.state.loc = res.data.name;
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  render() {
    return (
      <div className="weather-thumbnail-item">
        <div className="weather-thumbnail-header">
          <h1 className="">Weather</h1>
        </div>
        <div className="weather-thumbnail-icon">
          <img src={this.state.logo} alt=""/>
        </div>
        <div className="weather-thumbnail-temp">
          <p>{this.state.temp} degrees</p>
        </div>
        <div className="weather-thumbnail-loc">
          <p className="">{this.state.loc}</p>
        </div>
      </div>
    )
  }
}

export default WeatherThumbnail;