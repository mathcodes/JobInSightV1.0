import React, { Component } from 'react'
import "./style.css";
import axios from 'axios';
import pictureFrame from './assets/Add_picture.png';

class PhotosThumbnail extends Component {

  state = {

  }

  componentDidMount() {
    this.props.getImageData();
  }

  render() {
    return (
      <div className="photos-thumbnail-item">
        <div className="photos-thumbnail-header">
          <h1 className="">Photos</h1>
        </div>
        <div className="photos-thumbnail-container">
            { this.props.imageData.slice(0,4).map((imgObj, ind) => {
            return (
            <div className="photos-thumbnail-content">
              <div className="photos-thumbnail-pic">
                <img key={ind} className="photos-thumbnail-img" src={`data:${imgObj.contentType};base64,${
                  btoa(new Uint8Array(imgObj.image.data).reduce(function (data, byte) {
                      return data + String.fromCharCode(byte);
                  }, ''))}`} />
              </div>
            </div>
              )
            })}
        </div>
      </div>
    )
  }
}

export default PhotosThumbnail;