const cookieSession = require('cookie-session');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const port = 3000;

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,accept,content-type,authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.static('images'));

// Add post data to req.body
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(req.method + ', url: ' + req.url);
  next();
});

app.use('', require('./modules/auth'))
app.use('/photos', require('./modules/photos'))
app.use('/comments', require('./modules/comments'))
app.use('/rating', require('./modules/rating'))

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  console.error('Internal error(%d): %s', res.statusCode, err.message)
  res.send(err.message)
})

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});