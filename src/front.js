const express = require('express')
const {name: NAME, version: VERSION} = require('../package.json')
const db = require('./db')

const router = express.Router()

// Default Route
router.get('/', (req, res) => {
  res.render('home', { title: NAME, 'version' : VERSION })
})

// Default Route
router.get('/list/:key', (req, res) => {
  const key = req.params.key
  if (!db.vaildKey(key)) {
    res.redirect('/')
    return
  }

  res.render('list', {
    title: 'Where is my raspberry pi?',
    'version' : VERSION,
    key
  })
})

module.exports = router
