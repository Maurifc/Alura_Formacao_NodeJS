const passport = require('passport')

module.exports = {
    local: (req, res, next) => {
        passport.authenticate(
        'local',
        { session: false },
        (erro, usuario, info) => {
            if(erro && erro.name === 'InvalidArgumentError')
                return res.status(401).json({ erro: erro.message })
            
            if(erro)
                return res.status(500).json({ erro: erro.message })
            
            if(erro === null && usuario === false)
                return res.status(401).json()

            req.user = usuario
            return next()
        })(req, res, next)
    },

    bearer: (req, res, next) => {
        passport.authenticate(
            'bearer',
            { session: false },
            (erro, usuario, info) => {
                if(erro && erro.name === 'JsonWebTokenError')
                    return res.status(401).json({ erro: erro.message })

                if(erro && erro.name === 'TokenExpiredError')
                    return res.status(401).json({ erro: erro.message, expiradoEm: erro.expiredAt  })
                
                if(erro)
                    return res.status(500).json({ erro: erro.message })

                if(erro === null && usuario === false)
                    return res.status(401).json()
                
                req.token = info.token // Get token, sent by estrategia-autenticacao -> bearer, and add it to user request
                req.user = usuario
                return next()
            }
        )(req, res, next)
    }

}