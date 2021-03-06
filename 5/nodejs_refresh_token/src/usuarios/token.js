const crypto = require("crypto");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const { InvalidArgumentError } = require('../erros')
const allowListRefreshToken = require("../../redis/allowlist-refresh-token");
const blocklistAccessToken = require('../../redis/blocklist-access-token');


function criaTokenJWT(id, [tempoQuantidade, tempoUnidade]) {
  const payload = {
    id: id,
  };

  const token = jwt.sign(payload, process.env.CHAVE_JWT, { expiresIn: tempoQuantidade+tempoUnidade });
  return token;
}

async function verificaTokenJWT(token, nome, blocklist){

  await verificaTokenNaBlocklist(token, nome, blocklist);

  const { id } = jwt.verify(token, process.env.CHAVE_JWT);
  return id
}

async function verificaTokenNaBlocklist(token, nome, blocklist) {
  if(!blocklist)
    return

  const tokenNaBlocklist = await blocklist.contemToken(token);
  if (tokenNaBlocklist) {
    throw new jwt.JsonWebTokenError(`${nome} invalidado por logout!`);
  }
}

function invalidaTokenJWT(token, blocklist){
  return blocklist.adiciona(token);
}
  
// Create a refresh token
async function criaTokenOpaco(id, [tempoQuantidade, tempoUnidade], allowlist) {
  const tokenOpaco = crypto.randomBytes(24).toString("hex");                    // Generates 24 random bytes in hex format
  const dataExpiracao = moment().add(tempoQuantidade, tempoUnidade).unix();                            // expirationDate = Current datetime + 5 days (then convert to unix timestamp)
  await allowlist.adiciona(tokenOpaco, id, dataExpiracao);  // Adds the new token to allowlist, otherwise it will not work
  return tokenOpaco;
}

async function verificaTokenOpaco(token, nome, allowlist){
  verificaTokenEnviado(token, nome);               // Check if refresh token was sent on request
  
  const id = await allowlist.buscaValor(token)     // Get user id from refresh token (key)
  
  verificaTokenValido(id, nome);                   // Check if user was, really, retrieved from refresh token

  return id
}

// Check if refresh token is valid (key returned a valid user id)
function verificaTokenValido(id, nome) {
  if (!id) {
    throw new InvalidArgumentError(`${nome} inv??lido`, nome);
  }
}

// Check if refresh token was sent on request
function verificaTokenEnviado(token, nome) {
  if (!token)
    throw new InvalidArgumentError(`${nome} n??o enviado!`, nome);
}

async function invalidaTokenOpaco(token, allowlist){
  await allowlist.deleta(token)
}

// Export Token functions
module.exports = {
    // Access token related functions
    access: {
        // Some attributes
        nome: 'access token',
        lista: blocklistAccessToken,
        expiracao: [15, 'm'],

        // Create a JWT Token (user login / token refreshing)
        cria(id){
            return criaTokenJWT(id, this.expiracao);
        },

        // Check if JWT Token is valid ( authorization )
        verifica(token){
          return verificaTokenJWT(token, this.nome, this.lista)
        },

        // Invalidate token ( when user logs out)
        invalida(token){
          return invalidaTokenJWT(token, this.lista)
        }
    },

    refresh: {
        nome: 'refresh token',
        expiracao: [5, "d"],
        lista: allowListRefreshToken,
        cria(id){
            return criaTokenOpaco(id, this.expiracao, this.lista)
        },
        verifica(token){
          return verificaTokenOpaco(token, this.nome, this.lista)
        },
        invalida(token){
          return invalidaTokenOpaco(token, this.lista)
        }
    },

    verificacaoEmail: {
      // Some attributes
      nome: 'token verifica????o de e-mail',
      expiracao: [1, 'h'],

      // Create a JWT Token (user login / token refreshing)
      cria(id){
          return criaTokenJWT(id, this.expiracao);
      },

      // Check if JWT Token is valid ( authorization )
      verifica(token){
        return verificaTokenJWT(token, this.nome)
      },
  },
}