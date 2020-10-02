import React, { Component } from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import { Menu, Sidebar, Icon, } from 'semantic-ui-react'

import Auth from './auth/Auth'
//import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Images } from './components/Images'
import { UserImages } from './components/UserImages'
import { PublishImage } from './components/PublishImage'

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
            <Menu.Item as={Link} to='/published'>
              <Icon name='globe' />
          Published
        </Menu.Item>
            :""
          }
          {loggedIn
            ?
            <Menu.Item as={Link} to='/unpublished'>
              <Icon name='upload' />
          Uploaded
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
              path="/published"
              exact
              render={props => {
                return <UserImages {...props} auth={this.props.auth} />
              }}
            />
            <Route
              path="/unpublished"
              exact
              render={props => {
                return <PublishImage {...props} auth={this.props.auth} />
              }}
            />
            <Route component={NotFound} />
          </Switch>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}
