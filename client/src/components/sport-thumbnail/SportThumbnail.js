import React, { Component } from 'react'
import "./style.css";
import axios from 'axios';

class SportThumbnail extends Component {

  state = {
    teamName: ""
  }

  componentDidMount() {
    this.props.getTeamName();
  }

  render() {
    const teamName = this.props.teamName;
    return (
      <div className="sport-thumbnail-item">
        <div className="sport-thumbnail-header">
          <h1 className="">Sport</h1>
        </div>
        <div className="sport-thumbnail-headline">
          <h2>{teamName.charAt(0).toUpperCase() + teamName.slice(1) || "No Team"}</h2>
        </div>
      </div>
    )
  }
}

export default SportThumbnail;