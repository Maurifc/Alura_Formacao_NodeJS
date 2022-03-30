const passport = require('passport');
const allowlistRefreshToken = require('../../redis/allowlist-refresh-token')
const Usuario = require('./usuarios-modelo')
const tokens = require('./token')

async function invalidaRefreshToken(refreshToken){
  if(!refreshToken)
    throw new InvalidArgumentError('Refresh token não enviado!')

  await allowlistRefreshToken.deleta(refreshToken)
}

module.exports = {
  local(req, res, next) {
    passport.authenticate(
      'local',
      { session: false },
      (erro, usuario, info) => {
        if (erro && erro.name === 'InvalidArgumentError') {
          return res.status(401).json({ erro: erro.message });
        }

        if (erro) {
          return res.status(500).json({ erro: erro.message });
        }

        if (!usuario) {
          return res.status(401).json();
        }

        req.user = usuario;
        return next();
      }
    )(req, res, next);
  },

  bearer(req, res, next) {
    passport.authenticate(
      'bearer',
      { session: false },
      (erro, usuario, info) => {
        if (erro && erro.name === 'JsonWebTokenError') {
          return res.status(401).json({ erro: erro.message });
        }

        if (erro && erro.name === 'TokenExpiredError') {
          return res
            .status(401)
            .json({ erro: erro.message, expiradoEm: erro.expiredAt });
        }

        if (erro) {
          return res.status(500).json({ erro: erro.message });
        }

        if (!usuario) {
          return res.status(401).json();
        }

        req.token = info.token;
        req.user = usuario;
        return next();
      }
    )(req, res, next);
  },

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body                         // Get refresh token sent through body
      const id = await tokens.refresh.verifica(refreshToken)      // Check if is valid and returns user id
      invalidaRefreshToken(refreshToken)                        // Prevent token use another time
      req.user = await Usuario.buscaPorId(id)                   // Inject user object on request
      return next()      
    } catch (error) {
      if (error.name === 'InvalidArgumentError')
        return res.status(401).send({ erro: error.message })
      
      return res.status(500).send({ erro: error.message})
    }
  }
};
