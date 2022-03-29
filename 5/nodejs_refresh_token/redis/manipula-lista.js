const { promisify } = require('util')

module.exports = lista => { // Lista is the function argument (Redis Client)
    const setAsync = promisify(lista.set).bind(lista)                           // promisify is necessary as redis functions doesnt support promises
    const existsAsync = promisify(lista.exists).bind(lista)
    const getAsync = promisify(lista.get).bind(lista)
    const delAsync = promisify(lista.del).bind(lista)

    return {
        async adiciona(chave, valor, dataExpiracao) {
          await setAsync(chave, valor)                  // Insert a key/value on redis
          lista.expireat(chave, dataExpiracao)
        },
        
        async buscaValor(chave){
            return getAsync(chave)                      // Retrieves a value from a key
        },

        async contemToken(chave) {
            const resultado = await existsAsync(chave)  // Check if key is already on redis
            return resultado === 1
        },

        async deleta(chave){
            await delAsync(chave)                       // Remove a key/value from redis
        }
    }
}