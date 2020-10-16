import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Menu, Sidebar, Icon, } from 'semantic-ui-react'

import Auth from './auth/Auth'
//import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Images } from './components/Images'
import { UserImages } from './components/UserImages'
import { NewImage } from './components/NewImage'
import { EditImage } from './components/EditImage'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    const loggedIn = this.props.auth.isAuthenticated()
    return (
      <Sidebar.Pushable style={{transform: "none"}}>
        <Sidebar
          as={Menu}
          animation='push'
          direction='left'
          icon='labeled'
          inverted
          visible
          vertical
          width='thin'
        >
        <Menu.Item as={Link} to='/'>
          <Icon name='home' />
          Home
        </Menu.Item>
          {loggedIn
            ?
            <Menu.Item as={Link} to='/images'>
              <Icon name='images' />
              My Account
            </Menu.Item>
            : ""
          }
          {loggedIn
          ?
          <Menu.Item name="logout" onClick={this.handleLogout}>
            <Icon name='sign-out' />
            Logout
          </Menu.Item>
          :
            <Menu.Item name="login" onClick={this.handleLogin}>
              <Icon name='sign-in' />
            Login
          </Menu.Item>
          }
        </Sidebar>
        <Router history={this.props.history}>
          {this.generateCurrentPage()}
        </Router>
      </Sidebar.Pushable>
    )
  }

  generateCurrentPage() {
    return (
          <Sidebar.Pusher>
            <Switch>
              <Route
                path="/"
                exact
                render={props => {
                  return <Images {...props} auth={this.props.auth} />
                }}
              />
              <Route
                path="/images"
                exact
                render={props => {
                  return <UserImages {...props} auth={this.props.auth} />
                }}
              />
              <Route
                path="/images/create"
                exact
                render={props => {
                  return <NewImage {...props} auth={this.props.auth} />
                }}
              />
            <Route
            path="/images/:imageId/edit"
              exact
              render={props => {
                return <EditImage {...props} auth={this.props.auth} />
              }}
            />
              <Route component={NotFound} />
            </Switch>
          </Sidebar.Pusher>
    )
  }
}
