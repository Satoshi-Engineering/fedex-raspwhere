const express = require('express')
const db = require('./db.js')

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

router.post('/delete-key/:key?', (req, res) => {
  const key = req.params.key
  db.deleteKey(key)
  res.json({ status: 'ok' }).end()
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

  db.addPing(key, req.body.ip.trim(), req.body.hostname.trim(), req.body.fqdn.trim())

  res.json({ status: 'ok' }).end()
})

router.get('/fellowes/:key/', (req, res) => {
  const key = req.params.key
  if (!db.vaildKey(key)) {
    res.status(401).json({ status: 'error', message: 'unknown key' }).end()
    return
  }

  const fellowes = db.getFellowes(key)
  let sortedFellowes = Object.values(fellowes)
      .map((fOrig) => {
        let f = { ...fOrig }
        if (typeof f.fqdn !== 'string' || f.fqdn.length <= 0) {
          delete f.fqdn
        }
        if (f.ip) {
          f.ips = f.ip.split(' ')
        } else {
          f.ips = []
        }
        delete f.ip
        return f
      })
      .sort((a,b) => {
        return b.tsutc - a.tsutc
      })

  res.json({ status: 'ok', fellowes: sortedFellowes }).end()
})

module.exports = router
