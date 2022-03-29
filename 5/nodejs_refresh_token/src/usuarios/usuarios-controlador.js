const crypto = require("crypto")
const moment = require("moment")
const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError } = require('../erros');

const jwt = require('jsonwebtoken');
const blocklist = require('../../redis/blocklist-access-token')
const allowListRefreshToken = require('../../redis/allowlist-refresh-token');

function criaTokenJWT(usuario) {
  const payload = {
    id: usuario.id,
  };

  const token = jwt.sign(payload, process.env.CHAVE_JWT, { expiresIn: '15m' });
  return token;
}

async function criaTokenOpaco(usuario) {
  const tokenOpaco = crypto.randomBytes(24).toString('hex') // Generates 24 random bytes in hex format
  const dataExpiracao = moment().add(5, 'd').unix()         // Current datetime + 5 days and then convert to unix timestamp
  await allowListRefreshToken.adiciona(tokenOpaco, usuario.id, dataExpiracao)
  return tokenOpaco
}

module.exports = {
  async adiciona(req, res) {
    const { nome, email, senha } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email,
      });
      await usuario.adicionaSenha(senha);
      await usuario.adiciona();

      res.status(201).json();
    } catch (erro) {
      if (erro instanceof InvalidArgumentError) {
        return res.status(400).json({ erro: erro.message });
      }
      res.status(500).json({ erro: erro.message });
    }
  },

  async login(req, res) {
    try {
      const accessToken = criaTokenJWT(req.user);
      const refreshToken = await criaTokenOpaco(req.user)
      res.set('Authorization', accessToken);
      res.status(200).json({ refreshToken });
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  },

  async logout(req, res) {
    try {
      const token = req.token;
      await blocklist.adiciona(token);
      res.status(204).json();
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  },

  async lista(req, res) {
    try {
      const usuarios = await Usuario.lista();
      res.json(usuarios);
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  },

  async deleta(req, res) {
    try {
      const usuario = await Usuario.buscaPorId(req.params.id);
      await usuario.deleta();
      res.status(200).json();
    } catch (erro) {
      res.status(500).json({ erro: erro });
    }
  },
};
