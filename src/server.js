const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('express-favicon');
const fs = require('fs');
const cors = require('cors')
const helmet = require('helmet')
const xstAttack = require('./xstAttack')

const PORT = process.env.NODE_PORT || 2222;

const NAME = require('./../package.json').name;
const VERSION = require('./../package.json').version;


const app = express();
app.use(favicon(__dirname + '/../static/img/favicon.png'));
app.use('/static', express.static('static'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors())
app.use(helmet())
app.use(xstAttack)

// Template Engine
app.engine('ntl', function (filePath, options, callback) { // define the template engine
  fs.readFile(filePath, function (err, content) {
    if (err) return callback(err)
    // this is an extremely simple template engine
    let rendered = content.toString();

    for (const [key, value] of Object.entries(options)) {
      if (key == 'settings') continue;
      if (key == '_locals') continue;
      if (key == 'cache') continue;

      let re = new RegExp(`#${key}#`, "g");
      rendered = rendered.replace(re, value);
    }

    return callback(null, rendered)
  })
})
app.set('views', './pages') // specify the views directory
app.set('view engine', 'ntl') // register the template engine

// -----------------------> Logging
app.use((req, res, next) => {
  console.log(`${req.method}:${req.url} ${res.statusCode}`);
  next();
});

// Add 404
const add404 = () => {
  app.use((req, res, next) => {
    res.status(404).render("error", {
      title: "404",
      message : `Page not found 🤔<br><span style="font-style: normal;">${req.method} ${req.path}</span>`,
      name: NAME,
      version: VERSION,
    });
  });
}

let server
const start = (callback) => {
  add404();

  server = app.listen(PORT, () => { // Listen on port 3000
    console.log(`Listening on ${PORT}`); // Log when listen success

    if (callback != undefined) {
      callback();
    }
  });
}

process.on('SIGINT', function() {
  console.log('SIGINT signal received: closing server ...')

  server.close(() => {
    console.log('server closed')
    process.exit(0)
  })
})

process.on('SIGTERM', function() {
  console.log('SIGTERM signal received: closing server ...')

  server.close(() => {
    console.log('server closed')
    process.exit(0)
  })
})

module.exports = {
  app: app,
  start
}
