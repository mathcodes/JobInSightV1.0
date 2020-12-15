import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import classnames from "classnames";
import axios from 'axios';
import auth from '../auth/auth';
import "./style.css";
import TasksThumbnail from '../tasks-thumbnail/TasksThumbnail';
import PhotosThumbnail from '../photos-thumbnail/PhotosThumbnail';


class Dashboard extends Component {

  state = {
    username: "",
    email: "",
    prevScrollpos: window.pageYOffset,
    visible: true
  };

  handleChange = (e) => {
  }

  async componentDidMount () {
    this.setState({ state: this.state });
    window.addEventListener("scroll", this.handleScroll);
    const token = localStorage.getItem('token');
    const headerConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `${token}`
      }
    }
    try {
      const res = await axios.get('/api/users/getuser', headerConfig);
      if (res.status === 200) {
        // Set username
        this.setState({
          username: res.data.username,
          email: res.data.email
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  // hide logout on scroll down - This is causing the pie chart to re render
  handleScroll = () => {
    const { prevScrollpos } = this.state;
  
    const currentScrollPos = window.pageYOffset;
    const visible = prevScrollpos > currentScrollPos;
  
    this.setState({
      prevScrollpos: currentScrollPos,
      visible
    });
  };


  
  render() {
    const { username } = this.state;
    if (auth.isAuthenticated()) {
      return (
        <React.Fragment>
        
          <div className="dashboard-header" value={username}>
            <h3>Welcome to JobInSight <span className="spanName">{username}</span>!</h3>
            <button className={classnames("logout-button", {
              "logout-button--hidden": !this.state.visible
            })}
            onClick={() => {
            auth.logout(()=>{
            this.props.history.push('/');
            localStorage.clear();
            });
          }}><i className="fas fa-sign-out-alt fa-2x"></i></button>
          </div>
          <div className="dashboard-container">




            
            <Link
              to={{
                pathname: '/photos'
              }}
              className="photos-link"><PhotosThumbnail imageData={this.props.imageData} getImageData={this.props.getImageData}/></Link>
            
        
            <Link
              to={{
                pathname: '/tasks'
              }}
              className="tasks-link"><TasksThumbnail tasks={this.props.tasks} getTasksData={this.props.getTasksData}/></Link>
            
            

          </div>
         
        </React.Fragment>
      )
    } else {
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


export default Dashboard;