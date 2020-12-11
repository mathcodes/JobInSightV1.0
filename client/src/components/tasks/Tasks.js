import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import BackButton from '../utils/BackButton';
import "./style.css";
import axios from 'axios';
import auth from '../auth/auth';

class Tasks extends Component {

  constructor() {
    super()
    this.state = {
      tasks: [],
      task: '',
      goBack: false
    }

    // set bindings
    this.handleInputChange = this.handleInputChange.bind(this);
    this.submitTask = this.submitTask.bind(this);
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  setGoBack = (e) => {
    this.setState({
      goBack: true
    })
  }

  submitTask = async (e) => {
    e.preventDefault();
    let task = this.state.task;

    if (task === "") {
      alert('Please enter a name for the task');
    }
    // post entire task data to api
    const token = localStorage.getItem('token');
    const headerConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `${token}`
      }
    }
    const taskObj = {
      task: this.state.task,
      completed: false
    }
    try {
      const res = await axios.post('/api/tasks', taskObj, headerConfig);
      if (res.status === 200) {
        this.setState({
          task: ""
        });
        this.props.triggerParentUpdate();
        this.props.taskAddGoodRequest();
      }
    } catch (err) {
      this.props.taskAddBadRequest();
    }
  }

  deleteTask = async (e) => {
    e.preventDefault();

    const task = e.target.parentElement.firstChild.value;

    let flag = window.confirm('Are you sure you want to delete this task?');

    // send task data to api
    const token = localStorage.getItem('token');
    const headerConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `${token}`
      },
      // Serialize json data
      data: JSON.stringify({
        task: task
      })
    }

    if(flag) {
      try {
        const res = await axios.delete('/api/tasks', headerConfig);
        if (res.status === 200) {
          this.props.triggerParentUpdate();
          this.props.taskDelGoodRequest();
        }
      } catch (err) {
        this.props.taskDelBadRequest();
      }
    }
  }

  toggleCheck = async (e) => {
    const task = e.target.parentElement.firstChild.value;
    const completed = e.target.checked;

    // send task completed data to api
    const token = localStorage.getItem('token');
    const headerConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `${token}`
      },
    }

    const body = {
      task: task,
      completed: completed
    }

    try {
      const res = await axios.put('/api/tasks', body, headerConfig);
      if (res.status === 200) {
        this.props.triggerParentUpdate();
        this.props.taskEditGoodRequest();
      }
    } catch (err) {
      this.props.taskEditBadRequest();
    }
  }

  async componentDidMount() {
    this.props.getTasksData();
    // get all the tasks for the current user
    const taskData = this.props.tasks;
    if (taskData) {
      this.setState({
        tasks: taskData
      });
    }
  }

  render() {
    if (this.state.goBack) {
      return <Redirect to='/dashboard' />;
    }
    if (auth.isAuthenticated()) {
    return (
      <div className="tasks-item">
        <div className="tasks-header">
          <h1>Tasks</h1>
          <BackButton triggerParentUpdate={this.setGoBack}/>
        </div>
        <div className="tasks-form-container">
          <form className="tasks-form" onSubmit={this.submitTask}>
            <input placeholder="Add task" className="form-control" type="text" name="task" value={this.state.task} onChange={this.handleInputChange}/>
          </form>
          {/* <button className="tasks-btn" onClick={this.submitTask}></button> */}
        </div>
        <div className="tasks-content">
          {this.props.tasks.map((val, ind) => {
            return (
              <div className="tasks-item" key={val._id}>
                <input className="form-control" type="text" name="task" value={val.task}/>
                <input onChange={this.toggleCheck} type="checkbox" checked={val.completed}/>
                <button onClick={this.deleteTask} className="tasks-btn">Delete</button>
              </div>
            )
          })}
        </div>
      </div>
    ) } else {
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

export default Tasks;