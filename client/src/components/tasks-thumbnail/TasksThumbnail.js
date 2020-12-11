import React, { Component } from 'react'
import "./style.css";

class TasksThumbnail extends Component {

  state = {
    tasks: []
  }

  componentDidMount() {
    this.props.getTasksData();
  }

  render() {
    const tasks = this.props.tasks.slice(0, 3); // Only render top 3
    const noTasks = this.props.tasks.length === 0;
    return (
      <div className="tasks-thumbnail-item">
        <div className="tasks-thumbnail-header">
          <h1 className="">Tasks</h1>
        </div>
        <div className="tasks-thumbnail-content">
          {!noTasks ? (
            tasks.map((val, ind) => {
              return this.props.tasks.length > 0 ? <li key={val._id}>{val.task}<span><input type="checkbox" checked={val.completed} disabled="disabled"/></span></li>
                : <li>{"No Tasks"}</li>
            })
            ) : (<h1>No Tasks</h1>)
          }
        </div>
      </div>
    )
  }
}

export default TasksThumbnail;