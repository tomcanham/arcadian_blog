import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
// import request from 'request';

//0069CP9WiZd7nUx6ptUbVsBp3x1u_HKuFqMjpia4YQ -- keep this! API for blog

export default withAuth(class Home extends Component {
  constructor(props) {
    super(props);
    console.log('PROPS:', props);
    this.state = { authenticated: null };
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.checkAuthentication();
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  async login() {
    // Redirect to '/' after login
    this.props.auth.login('/');
  }

  async logout() {
    // Redirect to '/' after logout
    this.props.auth.logout('/');
  }

  // async introspectToken() {
  //   const { auth: { getIdToken }} = this.props;
  //   const idToken = await getIdToken();

  //   return new Promise((resolve, reject) => request.post(
  //     'https://dev-811744.oktapreview.com/oauth2/ausiojbwstMbEb3210h7/v1/introspect',
  //     {
  //       form: {
  //         client_id: '0oaikfn4hb9Y6AU8H0h7',
  //         token: idToken,
  //         token_type_hint: 'id_token'
  //       }
  //     },
  //     function (error, response, body) {
  //       if (error) {
  //         reject(error);
  //       } else {
  //         resolve(JSON.parse(body));
  //       }
  //     }
  //   ));
  // }

  // async verifyToken() {
  //   const introspectData = await this.introspectToken();

  //   console.log(introspectData);
  //   if (!introspectData.active) {
  //     throw(new Error('Invalid or inactive ID token'));
  //   }
  // }

  render() {
    console.log('HERE');
    const { authenticated } = this.state;
    if (authenticated === null) return null;
    console.log(this.state);

    return authenticated ?
      <button onClick={this.logout}>Logout</button> :
      <button onClick={this.login}>Login</button>;
  }
});