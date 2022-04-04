const express = require('express')
const db = require('./db.js')

// Data Structure: keys.deviceName."name" .ping .ip

const router = express.Router()

const createKey = () => {
  const newKey = `${Math.random().toString(36).substring(2, 8)}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase()

  db.addKey(newKey)

  return newKey
}

router.post('/create-key', (req, res) => {
  const newKey = createKey()
  res.json({ status: 'ok', key: newKey }).end()
})

router.get('/check-key/:key?', (req, res) => {
  const key = req.params.key
  const validKey = db.vaildKey(key)
  res.json({ status: 'ok', valid: validKey }).end()
})

router.post('/ping/:key/', (req, res) => {
  const key = req.params.key
  if (!db.vaildKey(key)) {
    res.status(401).json({ status: 'error', message: 'unknown key' }).end()
    return
  }

  db.addPing(key, req.body.ip, req.body.hostname, req.body.fqdn)

  res.json({ status: 'ok' }).end()
})

module.exports = router
