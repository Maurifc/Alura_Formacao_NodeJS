const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');
const jwt = require('jsonwebtoken')
const blacklist = require('../../redis/manipula-blacklist')

function criaTokenJWT(usuario){
  const payload = {
    id: usuario.id
  }

  // Signs payload with a secret loaded from .env file
  const secret = process.env.CHAVE_JWT
  const expiracao = { expiresIn: '15m' }
  const token = jwt.sign(payload, secret, expiracao);
  return token;
}

module.exports = {
  adiciona: async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email
      });

      await usuario.adicionaSenha(senha)
      await usuario.adiciona();

      res.status(201).json();
    } catch (erro) {
      if (erro instanceof InvalidArgumentError) {
        res.status(422).json({ erro: erro.message });
      } else if (erro instanceof InternalServerError) {
        res.status(500).json({ erro: erro.message });
      } else {
        res.status(500).json({ erro: erro.message });
      }
    }
  },

  // Creates JTW token and send it through Authorization header
  login: (req, res) => {
    const token = criaTokenJWT(req.user) // user was injected on request after run local strategy (passport)
    res.set('Authorization', token)
    res.status(204).send();
  },

  logout: async (req, res) => {
    try {
      const token = req.token // token was injected by middlewares-autenticacao -> bearer
      await blacklist.adiciona(token)
      res.status(204).send()      
    } catch (error) {
      res.status(500).json( { erro: message} )
    }
  },

  lista: async (req, res) => {
    const usuarios = await Usuario.lista();
    res.json(usuarios);
  },

  deleta: async (req, res) => {
    const usuario = await Usuario.buscaPorId(req.params.id);
    try {
      await usuario.deleta();
      res.status(200).send();
    } catch (erro) {
      res.status(500).json({ erro: erro });
    }
  }
};
