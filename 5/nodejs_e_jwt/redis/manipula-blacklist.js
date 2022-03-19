const blacklist = require('./blacklist')
const { promisify } = require('util')
const { createHash } = require('crypto')

const existsAsync = promisify(blacklist.exists).bind(blacklist)
const setAsync = promisify(blacklist.set).bind(blacklist)

const jwt = require('jsonwebtoken')

function geraTokenHash(token){
    return createHash('sha256')
        .update(token)
        .digest('hex')
}

module.exports = {
    adiciona: async token => { // Add token to blacklist
        const dataExpiracao = jwt.decode(token).exp
        const tokenHash = geraTokenHash(token)
        await setAsync(tokenHash, '')
        blacklist.expireat(token, dataExpiracao)
    },
    contemToken: async token => { // Check if token is blacklisted
        const tokenHash = geraTokenHash(token)
        const resultado = await existsAsync(tokenHash)

       return resultado === 1 // 1 exists / 0 if doesn't 
    }
}