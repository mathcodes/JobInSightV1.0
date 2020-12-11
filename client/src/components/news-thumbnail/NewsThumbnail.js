import React, { Component } from 'react'
import "./style.css";
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { toast } from 'react-toastify';

class NewsThumbnail extends Component {

  state = {
    headline: "",
    article: "",
    image: "",
    fullArticle: ""
  }

  async getNewsXML() {
    // get json news object from server
    try {
      const res = await axios.get('/api/news/bbc', {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      if (res.status === 200) {
        // get news headline and description
        const newsData = res.data.rss.channel[0].item[0];
        this.setState({
          headline: newsData.title[0],
          article: newsData.description[0],
          image: res.data.rss.channel[0].image[0].url[0]
        });
        // update parent (dashboard) with news data
        this.props.triggerParentUpdate(this.state.headline, this.state.article, this.state.image);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async componentDidMount () {
    this.getNewsXML();
  }

  render() {
    return (
      <div className="news-thumbnail-item">
        <div className="news-thumbnail-header">
          <h1 className="">News</h1>
        </div>
        <div className="news-thumbnail-headline">
          <h2>{this.state.headline}</h2>
        </div>
        <div className="news-thumbnail-article">
          <p>{this.state.article}</p>
        </div>
      </div>
    )
  }
}

export default NewsThumbnail;