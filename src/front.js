const express = require('express')
const {name: NAME, VERSION} = require('../package.json')
const db = require('./db')

const router = express.Router()

// Default Route
router.get('/', (req, res) => {
  res.render('home', { title: NAME, 'version' : VERSION })
})

// Default Route
router.get('/list/:key', (req, res) => {
  if (!db.vaildKey(req.params.key)) {
    res.redirect('/')
    return
  }

  res.render('list', { title: 'Well Done', 'version' : req.params.key })
})

module.exports = router
