const redis = require('redis')
const manipulaLista = require('./manipula-lista')

const allowlist = redis.createClient({ prefix: 'allowlist-refresh-token:'}) // Create a redis client

module.exports = manipulaLista(allowlist) // Export functions on manipulaLista

