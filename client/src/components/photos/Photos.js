import React, { Component } from 'react'
import "./style.css";
import axios from 'axios';
import addButton from './assets/Plus_button.png';
import BackButton from '../utils/BackButton';
import auth from '../auth/auth';
import { Redirect } from 'react-router-dom';

class Photos extends Component {

  state = {
    setFile: '',
    setFilename: '',
    imageData: [],
    uploadedFile: '',
    goBack: false
  }

  updatePhotos = () => {

  }

  // getImageData = async (e) => {
  //   // get all the tasks for the current user
  //   const token = localStorage.getItem('token');
  //   const headerConfig = {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Access-Control-Allow-Origin': '*',
  //       'Authorization': `${token}`
  //     }
  //   }
  //   const res = await axios.get('/api/upload', headerConfig);
  //   if (res.data.images) {
  //     this.setState({
  //       imageData: res.data.images
  //     });
  //   }
  // }

  async componentDidMount() {
    // this.getImageData();
    this.props.getImageData();
    // get all the tasks for the current user
    const imageData = this.props.imageData;
    if (imageData) {
      this.setState({
        imageData: imageData
      });
    }
  }

  onSubmit = async (e) => {
    e.preventDefault();
    if (this.state.setFile === '') {
      alert('Please choose a file');
    } else {
      const formData = new FormData();
      formData.append('imageData', this.state.setFile);
      try {
        const res = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': localStorage.getItem('token')
          }
        });
        this.props.photoGoodRequest();
        this.setState({
          uploadedFile: res.data.file
        });
        this.props.triggerParentUpdate();
      } catch (err) {
        console.log(err);
        this.props.photoBadRequest();
      }
      this.props.getImageData();
    }
    // reset file input value
    const imgInput = document.getElementById('img-input');
    imgInput.value = '';
    this.setState({
      setFilename: '',
      setFile: ''
    });
  }

  deleteImage = async (e) => {
    e.preventDefault();

    const imageId = e.target.id;
    let flag = window.confirm('Are you sure you want to delete this image?');

    // send image data to api
    const token = localStorage.getItem('token');
    const headerConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `${token}`
      },
      // Serialize json data
      data: JSON.stringify({
        imageId: imageId
      })
    }
    console.log(headerConfig);

    if(flag) {
      try {
        const res = await axios.delete('/api/upload', headerConfig);
        if (res.status === 200) {
          this.props.triggerParentUpdate();
        }
      } catch (err) {
      }
    }
  }

  setGoBack = (e) => {
    this.setState({
      goBack: true
    })
  }

  onChange = (e) => {
    this.setState({
      setFile: e.target.files[0],
      setFilename: e.target.files[0].name
    });
  }

  // btoa(String.fromCharCode(...new Uint8Array(imgObj.image.data)))
  render() {
    if (this.state.goBack) {
      return <Redirect to='/dashboard' />;
    }
    if (auth.isAuthenticated()) {
      return (
        <div className="photos-item">
          <div className="photos-header">
            <h1>Photos</h1>
            <BackButton triggerParentUpdate={this.setGoBack}/>
          </div>
          <form className="photos-form">
            <div className="btn-wrapper">
              <label class="btn-file">
                <input id="img-input" name="imageData" type="file" onChange={this.onChange}/> {"Choose File:" + this.state.setFilename}
              </label>
            </div>
            <button className="add-img-btn" src={addButton} onClick={this.onSubmit}>Add</button>
          </form>

          <div className="photos-container">
              { this.props.imageData.map((imgObj, ind) => {
              return (
              <div className="photos-content">
                {/* <button className="del-img-btn">Delete</button> */}
                <div className="photos-pic">
                  <img id={imgObj._id} className="photos-img" src={`data:${imgObj.contentType};base64,${
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

export default Photos;