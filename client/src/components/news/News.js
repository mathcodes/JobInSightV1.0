import React, { Component } from 'react'
import "./style.css";
import { Redirect } from 'react-router-dom';
import imageBorder from './assets/Add_picture.png';
import BackButton from '../utils/BackButton';
import auth from '../auth/auth';

class News extends Component {

  state = {
    headline: "headline",
    article: "article",
    image: "",
    goBack: false
  }

  componentDidMount() {
    try {
      const {headline, article, image} = this.props.location.state.newsData;
      this.setState({
        headline: headline || undefined,
        article: article || undefined,
        image: image || undefined
      })
    } catch (err) {
      console.log(err);
    }
  }

  setGoBack = (e) => {
    this.setState({
      goBack: true
    })
  }

  render() {
    if (this.state.goBack) {
      return <Redirect to='/dashboard' />;
    }
    if (auth.isAuthenticated()) {
      return (
        <div className="news-item">
          <div className="news-header">
            <h1>News</h1>
            <img src={imageBorder} alt=""/>
            <BackButton triggerParentUpdate={this.setGoBack}/>
          </div>
          <div className="news-headline">
            <h2>{this.state.headline}</h2>
          </div>
          <div className="news-article">
            <p>{this.state.article}</p>
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

export default News;