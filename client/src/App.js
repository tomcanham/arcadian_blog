import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, ImplicitCallback } from '@okta/okta-react';
import Home from './Home';

const config = {
  issuer: 'https://dev-811744.oktapreview.com/oauth2/default',
  // eslint-disable-next-line camelcase
  redirect_uri: window.location.origin + '/implicit/callback',
  // eslint-disable-next-line camelcase
  client_id: '0oaikfn4hb9Y6AU8H0h7'
};

class App extends Component {
  render() {
    return (
      <Router>
        <Security issuer={config.issuer}
                  client_id={config.client_id}
                  redirect_uri={config.redirect_uri}
        >
          <Route path='/' exact={true} component={Home}/>
          <Route path='/implicit/callback' component={ImplicitCallback}/>
        </Security>
      </Router>
    );
  }
}

export default App;