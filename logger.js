/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express');
const app = express();

const port = 9000;
let reverse = false;
let refresh = 30;
let lines = [];
let logOutput = '';
let pathReplace = 'file:\/.*src\/';
// parse application/x-www-form-urlencoded
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  parameterLimit: 100000,
  limit: '50mb',
  extended: false
}));
app.use(bodyParser.json({
  parameterLimit: 100000,
  limit: '50mb',
  extended: false
}));
app.get('/', (req, res) => {
  if (req.query.reset) {
    logOutput = '';
    res.redirect('/');
    lines = [];
    return;
  }
  if (req.query.replace) {
    pathReplace = encodeURIComponent(req.query.replace);
  }
  if (req.query.reverse) {
    reverse = true;
  }

  if (req.query.refresh) {
    refresh = encodeURIComponent(req.query.refresh.toString());
  }
  for (let l of (reverse ? lines.slice().reverse() : lines)) {
    const line = l.replace(pathReplace, '');
    logOutput += '</br>' + line;
  }
  res.send('<head><meta http-equiv="refresh" content="' + refresh + '"/> </head><body><h1>LOG OUTPUT</h1>' + logOutput + '</body>');
});

app.listen(port, () => {
  console.log(`Listening for log message posts on ${port}`);
});

let i = 0;
let date = new Date();
app.post('/', (req, res) => {
  lines = lines.concat(req.body.lines);
  res.send('');
});

// eslint-disable-next-line no-undef
makeShortDate = () => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};
