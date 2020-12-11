import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import axios from 'axios';
import auth from './components/auth/auth';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import News from './components/news/News';
import Sport from './components/sport/Sport';
import Tasks from './components/tasks/Tasks';
import Photos from './components/photos/Photos';


class App extends Component {

  state = {
    sportData: {
      teamName: ''
    },
    tasksData: {
      tasks: []
    },
    imageData: [],
    loggedInStatus: "NOT_LOGGED_IN",
    
  }

  getTeamName = async () => {
    // get favourite team name from api
    try {
      const res = await axios.get('/api/news/sport/team', {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      if (res.status === 200) {
        // set teamName
        const teamName = res.data.team;
        this.setState({
          sportData: {
            teamName: res.data.team || ""
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.getImageData();
    this.getTasksData();
    // this.getTeamName();
  }

  // Get tasks data in App so we can pass as prop to Tasks & Dashboard components
  getTasksData = async (e) => {
    // get all the tasks for the current user
    const token = localStorage.getItem('token');
    const headerConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `${token}`
      }
    }
    const res = await axios.get('/api/tasks', headerConfig);
    if (res.data.tasks) {
      this.setState({
        tasksData: {
          tasks: [...res.data.tasks] || ""
        }
      });
    }
  }

  getImageData = async (e) => {
    // get all the images for the current user
    const token = localStorage.getItem('token');
    const headerConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `${token}`
      }
    }
    const res = await axios.get('/api/upload', headerConfig);
    if (res.data.images) {
      this.setState({
        imageData: res.data.images
      });
    }
  }

  // update sport data passed from child (Sport) to parent state (App)
  updateSportData = (teamName) => {
    this.setState({
      sportData: {
        teamName: teamName
      }
    });
  }

  // update tasks data passed from child (Sport) to parent state (App)
  updateTasksData = () => {
    this.getTasksData();
  }

  // update image data passed from child (Photos) to parent state (App)
  updateImageData = () => {
    this.getImageData();
  }

  notFoundStyle = {
    margin: '10rem',
    color: '#8b0000'
  }

  render() {
    // Toast Notifications
    toast.configure({autoClose: 2000, draggable: false});
    const sportBadRequest = () => toast.error('Team is invalid');
    const sportGoodRequest = () => toast.success('Team has been updated');
    const loginGoodRequest = () => toast.success('Logged in Successfully', {
      position: toast.POSITION.TOP_LEFT
    });

    const loginBadRequest = () => toast.error('Invalid Credentials');
    const registerGoodRequest = () => toast.success('Registered Successfully');
    const registerBadRequest = () => toast.error('Registration Unsuccessful');
    
    const taskAddGoodRequest = () => toast.success('Task added successfully', {
      position: toast.POSITION.TOP_CENTER
    });
    const taskAddBadRequest = () => toast.error('Task could not be added', {
      position: toast.POSITION.TOP_CENTER
    });
    const taskDelGoodRequest = () => toast.warning('Task deleted successfully', {
      position: toast.POSITION.TOP_CENTER
    });
    const taskDelBadRequest = () => toast.error('Task could not be deleted', {
      position: toast.POSITION.TOP_CENTER
    });
    const taskEditGoodRequest = () => toast.info('Task edited successfully', {
      position: toast.POSITION.TOP_CENTER
    });
    const taskEditBadRequest = () => toast.error('Task could not be edited', {
      position: toast.POSITION.TOP_CENTER
    });

    const photoGoodRequest = () => toast.success('Image added Successfully', {
      position: toast.POSITION.TOP_LEFT
    });

    const photoBadRequest = () => toast.error('Image could not be added', {
      position: toast.POSITION.TOP_LEFT
    });

    return (
    <Router>
      <div className="App">
        <div className="container">
          <Switch>
            <Route
              exact
              path="/(login|)/"
              render={(props) => <Login {...props} 
              loginGoodRequest={loginGoodRequest} 
              loginBadRequest={loginBadRequest} />} 
            />
            <Route path="/register"
              render={(props) => <Register {...props}
              registerGoodRequest={registerGoodRequest}
              registerBadRequest={registerBadRequest}/>}
            />
            <Route path="/dashboard"
              render={(props) => <Dashboard {...props} teamName={this.state.sportData.teamName} tasks={this.state.tasksData.tasks}
              getTeamName={this.getTeamName} getTasksData={this.getTasksData} imageData={this.state.imageData} getImageData={this.getImageData}/>  }
            />
            <Route path="/news" component={News} />
            <Route path="/sport"
              render={(props) => <Sport {...props} sportGoodRequest={sportGoodRequest} sportBadRequest={sportBadRequest} getTeamName={this.getTeamName}
              teamName={this.state.sportData.teamName} triggerParentUpdate={this.updateSportData}/>} />
            <Route path="/photos" 
              render={ (props) => <Photos {...props} photoGoodRequest={photoGoodRequest} photoBadRequest={photoBadRequest} triggerParentUpdate={this.updateImageData}
                      imageData={this.state.imageData} getImageData={this.getImageData}/>} />
              />
            <Route path="/tasks"
              render={(props) => <Tasks {...props} triggerParentUpdate={this.updateTasksData} tasks={this.state.tasksData.tasks} getTasksData={this.getTasksData}
                                  taskAddGoodRequest={taskAddGoodRequest} taskAddBadRequest={taskAddBadRequest} taskDelGoodRequest={taskDelGoodRequest}
                                  taskDelBadRequest={taskDelBadRequest} taskEditGoodRequest={taskEditGoodRequest} taskEditBadRequest={taskEditBadRequest}/>} />
            <Route path="*" component={() => <h1 style={this.notFoundStyle}>404 Not Found</h1>} />
          </Switch>
        </div>
      </div>
    </Router>
  );
  }
}

export default App;
