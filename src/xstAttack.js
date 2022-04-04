const express = require('express')

const router = express.Router()

const ALLOWED_METHODS = [
  'OPTIONS',
  'HEAD',
  'CONNECT',
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
]

router.use((req, res, next) => {
  if (!ALLOWED_METHODS.includes(req.method)) {
    res.status(405).send(`${req.method} not allowed 🤔`).end()
    return
  }

  next()
})

module.exports = router
