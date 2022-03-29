const redis = require('redis');
const manipulaLista = require('./manipula-lista')
const jwt = require('jsonwebtoken');
const { createHash } = require('crypto');

const blocklist = redis.createClient( { prefix: 'blocklist-access-token:' }) // blocklist is a redis client
const manipulaBlocklist = manipulaLista(blocklist)

// Create a hash from token
function geraTokenHash(token) {
  return createHash('sha256').update(token).digest('hex');
}

module.exports = {
  async adiciona(token) {
    const dataExpiracao = jwt.decode(token).exp;
    const tokenHash = geraTokenHash(token);
    await manipulaBlocklist.adiciona(tokenHash, '', dataExpiracao)
  },
  async contemToken(token) {
    const tokenHash = geraTokenHash(token);
    return manipulaBlocklist.contemToken(tokenHash);
  },
};
