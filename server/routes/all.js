const session = require('./session');

const all = [session];

module.exports = (app) => all.forEach((route) => route(app));