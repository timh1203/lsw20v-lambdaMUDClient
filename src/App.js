// Handles the authentication with axios calls
// Controls UI before and after logging in
// Renders signup form and main ui component
import React, { Component } from 'react'
import styled from 'styled-components'
import Signup from './components/Signup'
import Login from './components/Login'
import Main from './components/Main'
import axios from 'axios'
import background from './assets/images/background.jpg'
require('dotenv').config()

// Styled-Components
const Div1 = styled.div`
  background-image: url(${background});
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #2C7FCC;
  font-family: "Julee";
`

export default class App extends Component {
  state = {
    isCreatingUser: false,
    isLoggedIn: false,
  }

  // FUNCTION: check local storage for token to authenticate user
  // ARGUMENTS: none
  // RETURNS: if token present, sets isLoggedIn to true
  componentDidMount() {
    const token = localStorage.getItem('token')
    if (token) {
      this.setState({ isLoggedIn: true })
    }
  }

  // FUNCTION: registers a new user
  // ARGUMENTS: newUserObject contains new user information from <Signup /> component
  // RETURNS: sets token in local storage, sets isLoggedIn to true, closes form
  signup = (newUserObject) => {
    axios.post(process.env.REACT_APP_SERVER + '/api/registration/', newUserObject)
      .then(res => {
        localStorage.setItem('token', res.data.key)
        this.setState({ isLoggedIn: true })
      })
      .catch(function (error) {
        console.log(error);
      });
    this.toggleCreateUserForm()
  }

  // FUNCTION: logs in a user with existing credentials
  // ARGUMENTS: userObject packages exisiting information from <Login /> component
  // RETURNS: sets token in local storage and sets isLoggedIn to true
  login = (userObject) => {
    axios.post(process.env.REACT_APP_SERVER + '/api/login/', userObject)
      .then(res => {
        localStorage.setItem('token', res.data.key)
        this.setState({ isLoggedIn: true })
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  // FUNCTION: logs out a user
  // ARGUMENTS: event argument to prevent default action
  // RETURNS: removes token from local storage, set isLoggedIn to false
  logout = (e) => {
    e.preventDefault()
    localStorage.clear()
    this.setState({ isLoggedIn: false })
  }

  // FUNCTION: toggles ui to open/close new user signup form
  // ARGUMENTS: none
  // RETURNS: toggles isCreatingUser to true
  toggleCreateUserForm = () => {
    this.setState({ isCreatingUser: !this.state.isCreatingUser })
  }

  render() {
    return (
      <Div1>
        {
          !this.state.isLoggedIn && !this.state.isCreatingUser ? (
            <>
              <h1>Lambda MUD</h1>
              <Login
                toggleCreateUserForm={this.toggleCreateUserForm}
                login={this.login}
              />
            </>
          ) : null
        }
        {
          !this.state.isLoggedIn && this.state.isCreatingUser ? (
            <>
              <h1>Signup</h1>
              <Signup
                toggleCreateUserForm={this.toggleCreateUserForm}
                signup={this.signup}
              />
            </>
          ) : null
        }
        {
          this.state.isLoggedIn ? (
            <Main
              isLoggedIn={this.state.isLoggedIn}
              initialize={this.initialize}
              logout={this.logout}
            />
          ) : null
        }
      </Div1>
    );
  }
}
