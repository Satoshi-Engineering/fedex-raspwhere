const express = require('express')
const {name: NAME, VERSION} = require('../package.json')

const router = express.Router()

// Default Route
router.get('/', (req, res) => {
  res.render('home', { title: NAME, 'version' : VERSION })
})

// Default Route
router.get('/list/:key', (req, res) => {
  console.log(req.params.key)
  res.render('list', { title: 'Well Done', 'version' : req.params.key })
})

module.exports = router
