const Usuario = require("./usuarios-modelo");
const { InvalidArgumentError } = require("../erros");
const tokens = require('./token')
const { EmailVerificacao } = require('./emails')

function geraEndereco(rota, id){
  const baseURL = process.env.BASE_URL
  return `${baseURL}${rota}${id}`
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

      const endereco = geraEndereco('/usuario/verifica_email/', usuario.id)
      const emailVerificacao = new EmailVerificacao(usuario, endereco)
      console.log(endereco);

      emailVerificacao.enviaEmail() // async
          .catch(console.log)

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
      const accessToken = tokens.access.cria(req.user.id)
      const refreshToken = await tokens.refresh.cria(req.user.id);     // When user logins, create a refresh token to renew the access token
      res.set("Authorization", accessToken);                          // Access token is set on 'Authorization' response header...
      res.status(200).json({ refreshToken });                         // ... while refresh token is put on request body
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  },

  async logout(req, res) {
    try {
      const token = req.token;
      await tokens.access.invalida(token)
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
