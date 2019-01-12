import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import request from 'request';

//0069CP9WiZd7nUx6ptUbVsBp3x1u_HKuFqMjpia4YQ -- keep this! API for blog

export default withAuth(class Home extends Component {
  constructor(props) {
    super(props);
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

  async introspectToken(token, tokenTypeHint = 'id_token') {
    return new Promise((resolve, reject) => {
      request.post(
        'https://dev-811744.oktapreview.com/oauth2/default/v1/introspect',
        {
          form: {
            // eslint-disable-next-line camelcase
            client_id: '0oaikfn4hb9Y6AU8H0h7',
            token: token,
            // eslint-disable-next-line camelcase
            token_type_hint: tokenTypeHint
          }
        },
        function (error, response, body) {
          if (error) {
            reject(error);
          } else {
            resolve(JSON.parse(body));
          }
        }
      );
    });
  }

  async verifyToken() {
    const { auth: { getAccessToken }} = this.props;
    const token = await getAccessToken();

    if (token) {
      console.log('TOKEN:', token);
      const introspectData = await this.introspectToken(token, 'id_token');

      // eslint-disable-next-line no-console
      if (!introspectData.active) {
        throw(new Error('Invalid or inactive ID token'));
      }

      return introspectData;
    }
  }

  render() {
    const { authenticated } = this.state;
    if (authenticated === null) {
      return null;
    }

    if (authenticated) {
      this.verifyToken();
    }

    return authenticated ?
      <button onClick={this.logout}>Logout</button> :
      <button onClick={this.login}>Login</button>;
  }
});