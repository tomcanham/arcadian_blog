const OktaJwtVerifier = require('@okta/jwt-verifier');
const uuidv4 = require('uuid/v4');
const Cache = require('lru-cache-node');
const cookieSignature = require('cookie-signature');

const clientId = '0oaikfn4hb9Y6AU8H0h7';
const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://dev-811744.oktapreview.com/oauth2/default',
  clientId,
  assertClaims: {
    cid: clientId
  }
});

const MAX_AGE = 1000 * 60 * 60; // one hour cookie by default
const sessions = new Cache(1000, MAX_AGE); // just cache sessions in memory so we can clear cache by process restart

async function setSessionFromToken(token, secret) {
  const jwt = await oktaJwtVerifier.verifyAccessToken(token);
  if (jwt.claims.Blog && jwt.claims.Blog.includes('Blog.Reader') || jwt.claims.Blog.includes('Blog.Writer')) {
    const session = jwt.claims;
    const sessionId = uuidv4();
    session.token = token;
    session.sessionId = sessionId;
    sessions.set(sessionId, session);

    const signedValue = cookieSignature.sign(sessionId, secret);
    return { session, signedValue };
  }
}

function getSessionFromCookie(signedCookie, secret) {
  if (signedCookie) {
    const sessionId = cookieSignature.unsign(signedCookie, secret);
    return sessions.get(sessionId);
  }
}

function getUserForSession(session) {

}

module.exports = (app) => {
  const secret = app.get('secret');

  app.post('/session', async (req, res) => {
    const { token } = req.body;

    if (token) {
      try {
        const { session, signedValue } = await setSessionFromToken(token, secret);

        if (session) {
          const username = session.sub;
          console.log("USERNAME:", username);

          req.session = session;
          res.cookie('sessionId', signedValue, { maxAge: MAX_AGE, signed: true });
          res.json(session);
        }
      } catch (ex) {
        res.clearCookie('sessionId', { signed: true });

        if (ex.name === 'JwtParseError') {
          res.status(403).send(ex.message);
        } else {
          res.status(403).send(ex.message || 'Forbidden');
        }
      }
    }
  });

  app.use(async (req, res, next) => {
    const cookieSession = getSessionFromCookie(req.signedCookies.sessionId, secret);
    if (cookieSession) {
      req.session = cookieSession;
      next();
      return;
    }

    res.sendStatus(403);
  });

  app.get('/session', async (req, res) => {
    res.json(req.session);
  });

  app.delete('/session', (req, res) => {
    if (req.session && req.session.sessionId && sessions.contains(req.session.sessionId)) {
      sessions.delete(req.params.id);
      res.clearCookie('sessionId', { signed: true });
    }

    res.sendStatus(204);
  });
};