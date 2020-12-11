import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import "./style.css";
import axios from 'axios';
import auth from '../auth/auth';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import BackButton from '../utils/BackButton';

class Sport extends Component {

  state = {
    teamName: "",
    teamsBeaten: [],
    teamsArr: [],
    goBack: false
  }

  async componentDidMount() {
    this.props.getTeamName();
    this.setState({
      teamName: this.props.teamName
    });
    // get teams array
    try {
      const res = await axios.get('/api/news/sport', {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      if (res.status === 200) {
        // get teams arr
        const teamsArr = res.data;
        this.setState({
          teamsArr: teamsArr
        });
      }
    } catch (err) {
      console.log(err);
    }

    // get team list if user has already entered it
    // check teamsArr if there is a match
    // if it exists display the beaten teams
    const teamObj = this.state.teamsArr.find( obj => {
      return obj.teamName.toLowerCase() === this.state.teamName.toLowerCase();
    });
    if (teamObj !== undefined) {
      this.setState({
        teamsBeaten: teamObj.teamsBeaten
      });
    } else {
      this.setState({
        teamsBeaten: []
      });
    }
  }

  onSubmit = async (e) => {
    e.preventDefault();
    // post favourite team to server
    const teamObj = {
      team: this.state.teamName
    }
    try {
      const res = await axios.post('/api/news/sport/team', teamObj, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      if (res.status === 200) {
        this.props.sportGoodRequest();
      }
    } catch (err) {
      this.props.sportBadRequest();
      console.log(err);
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
    // check teamsArr if there is a match
    // if it exists display the beaten teams
    const teamObj = this.state.teamsArr.find( obj => {
      return obj.teamName.toLowerCase() === e.target.value.toLowerCase();
    });
    if (teamObj !== undefined) {
      // pass team name data to dashboard
      // update parent (app) with sport data
      // update parent (dashboard) with news data
      this.props.triggerParentUpdate(e.target.value);
      this.setState({
        teamsBeaten: teamObj.teamsBeaten
      });
    } else {
      this.props.triggerParentUpdate("");
      this.setState({
        teamsBeaten: []
      });
    }


  }

  setGoBack = (e) => {
    this.setState({
      goBack: true
    })
  }

  render() {
    const {teamName, teamsBeaten} = this.state;
    if (this.state.goBack) {
      return <Redirect to='/dashboard' />;
    }
    if (auth.isAuthenticated() || this.state.shouldUpdate) {
      const teamsElem = teamsBeaten.map((val, ind) => {
        return <li key={ind}>{val}</li>;
      });
      return (
        <div className="sport-item">
          <div className="sport-header">
            <h1>Champion's League Challenge</h1>
          </div>
          <BackButton triggerParentUpdate={this.setGoBack}/>

          <div className="sport-form-container">
              <form className="sport-form" onSubmit={this.onSubmit}>
                <div className="sport-form-group">
                  <input
                    type="text" 
                    name="teamName"
                    value={teamName}
                    onChange={this.handleChange}
                    className="form-control" 
                    placeholder="Team Name"/>
                </div>
              </form>
          </div>

          <div className="sport-content">
            <h2>These are the teams you won against:</h2>
            <div className="teams-beaten">
              <CSSTransitionGroup 
                transitionName="team"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnter={true}
                transitionEnterTimeout={500}
                transitionLeave={true}
                transitionLeaveTimeout={500}
                >
                {
                  teamsElem
                }
              </CSSTransitionGroup>
            </div>
          </div>


        </div>
    )} else {
          return <Redirect to={
            {
              pathname: '/',
              state: {
                from: this.props.location
              }
            }
          } />
      }
  } 
}

export default Sport;