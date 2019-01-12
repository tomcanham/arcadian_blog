const express = require('express');
const allRoutes = require('./routes/all');
const uuidv4 = require('uuid/v4');
const cookieParser = require('cookie-parser');

const app = express();
const port = 8000;

const APP_SECRET = process.env['APP_SECRET'] || uuidv4();
app.set('secret', APP_SECRET);

app.use(cookieParser(APP_SECRET));
app.use(express.json());

allRoutes(app);
app.get('/', (req, res) => {
  res.send('Hello World! ' + JSON.stringify(req.session, null, 2));
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Example app listening on port ${port}!`));