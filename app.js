require('dotenv').config()

const server = require('./src/server');
const front = require('./src/front')
const api = require('./src/api')

const {name: NAME, version: VERSION} = require('./package.json')
const app = server.app;

app.use(front)
app.use('/api', api)

server.start(() => {
  console.log("go!")
})

