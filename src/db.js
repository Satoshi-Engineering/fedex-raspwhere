const StormDB = require("stormdb");

// start db with "./db.stormdb" storage location
// INFO: Relative Path starts with root here?

const STORMDB_FILE = `${process.env.DATA_PATH || './data'}/db.stormdb`

console.info(`Opening StormDB File at ${STORMDB_FILE}`)
const engine = new StormDB.localFileEngine(STORMDB_FILE)
const db = new StormDB(engine);

// set default db value if db is empty
db.default({ keys: {} })

// save changes to db
db.save()

const addKey = (newKey) => {
  db.get('keys').set(newKey, {})
  db.save()
}

const vaildKey = (key) => {
  return db.get('keys').get(key).value() !== undefined
}

module.exports = {
  addKey,
  vaildKey
}
