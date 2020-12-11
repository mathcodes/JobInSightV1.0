import React, { Component } from 'react'

export class BackButton extends Component {

  handleGoBack = (e) => {
    this.props.triggerParentUpdate(true);
  }

  render() {
    return (
      <React.Fragment>
        <button className="back-button" onClick={this.handleGoBack}>
          Back
        </button>
      </React.Fragment>
    )
  }
}

export default BackButton
