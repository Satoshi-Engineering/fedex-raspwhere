const express = require('express')
const db = require('./db.js')

// Data Structure: keys.deviceName."name" .ping .ip

const router = express.Router()

const createKey = () => {
  const newKey = `${Math.random().toString(36).substring(2, 8)}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase()

  db.get('keys').set(newKey, {})

  return newKey
}

// Default Route
router.post('/create-key', (req, res) => {
  const newKey = createKey()
  res.json({ status: 'ok', key: newKey }).end()
})

module.exports = router
