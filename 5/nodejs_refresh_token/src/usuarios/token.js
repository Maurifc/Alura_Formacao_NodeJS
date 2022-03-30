const crypto = require("crypto");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const allowListRefreshToken = require("../../redis/allowlist-refresh-token");


function criaTokenJWT(id, [tempoQuantidade, tempoUnidade]) {
    const payload = {
      id: id,
    };
  
    const token = jwt.sign(payload, process.env.CHAVE_JWT, { expiresIn: tempoQuantidade+tempoUnidade });
    return token;
  }
  
  // Create a refresh token
  async function criaTokenOpaco(id, [tempoQuantidade, tempoUnidade], allowlist) {
    const tokenOpaco = crypto.randomBytes(24).toString("hex");                    // Generates 24 random bytes in hex format
    const dataExpiracao = moment().add(tempoQuantidade, tempoUnidade).unix();                            // expirationDate = Current datetime + 5 days (then convert to unix timestamp)
    await allowlist.adiciona(tokenOpaco, id, dataExpiracao);  // Adds the new token to allowlist, otherwise it will not work
    return tokenOpaco;
  }

module.exports = {
    access: {
        expiracao: [15, 'm'],
        cria(id){
            return criaTokenJWT(id, this.expiracao);
        }
    },

    refresh: {
        expiracao: [5, "d"],
        lista: allowListRefreshToken,
        cria(id){
            return criaTokenOpaco(id, this.expiracao, this.lista)
        }
    }
}