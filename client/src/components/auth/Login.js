import React, { Component } from "react";
import axios from "axios";
import auth from "./auth";
import { Link, Redirect } from "react-router-dom";
import "./style.css";

class Login extends Component {
  state = {
    username: "",
    usernameError: "",
    password: "",
    passwordError: "",
    errorMessage: "",
    redirect: false,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = async (e) => {
    this.setState({
      errorMessage: "",
    });
    e.preventDefault();
    const user = {
      username: this.state.username,
      password: this.state.password,
    };
    try {
      const res = await axios.post("/api/users/login", user);
      if (res.status === 200) {
        // store jwt token in local storage (Should implement better solution)
        localStorage.setItem("token", res.data.token);
        // authenticate user
        auth.login(() => {
          this.props.loginGoodRequest();
          this.props.history.push("/");
        });
        this.setState({ redirect: true });
      }
    } catch (err) {
      this.setState({
        errorMessage: "Invalid username or password",
      });
      this.props.loginBadRequest();
    }
  };

  render() {
    const { redirect } = this.state;
    if (auth.isAuthenticated()) {
      return <Redirect to="/dashboard" />;
    } else {
    }
    const { username, password } = this.state;
    return (
      <React.Fragment>
        <div className="register-container">
          <div className="form-header text-light text-md-right text-center banner">
            <h2 className="banner-par">Welcome to</h2>
            <h1 className="lead banner-heading">J o b I n S i g h t</h1>
          </div>
         
          <div className="form-container-login">
            <form className="login-form" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <input
                  autocomplete="nope"
                  type="text"
                  name="username"
                  value={username}
                  onChange={this.handleChange}
                  className="form-control"
                  placeholder="Username"
                />
                <small>{this.state.errorMessage}</small>
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.handleChange}
                  className="form-control"
                  placeholder="Password"
                />
              </div>

              <button type="submit" className="login-btn">
                LOGIN
              </button>
            </form>
          </div>
          <p className="linkBtn">
            Ready for your Future of Fortune?
            <Link className="link" to="/register">
              Sign Up
            </Link>
          </p>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
