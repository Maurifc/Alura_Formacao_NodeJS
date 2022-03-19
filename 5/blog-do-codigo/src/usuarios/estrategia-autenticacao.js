const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const BearerStrategy = require('passport-http-bearer').Strategy
const { InvalidArgumentError } = require('../erros')
const bcrypt = require('bcrypt')
const Usuario = require('./usuarios-modelo')
const jwt = require('jsonwebtoken')

function verificaUsuario(usuario){
    if(!usuario)
        throw new InvalidArgumentError('Não existe suário com esse e-mail')
}

async function verificaSenha(senha, senhaHash){
    const senhaValida = await bcrypt.compare(senha, senhaHash) // Check if password and hash matches

    if(!senhaValida)
        throw new InvalidArgumentError('E-mail ou senha inválidos')

}

// Local strategy checks if username/email and passwords are valid
// When everything is OK, passport inject usuario on request object
passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'senha',
        session: false
    }, async (email, senha, done) => {
        try {
            const usuario = await Usuario.buscaPorEmail(email)
            verificaUsuario(usuario)  // Check if user exists 
            await verificaSenha(senha, usuario.senhaHash)
            done(null, usuario) // Injects usuario on request object
        } catch (error) {
            done(error)
        }
    })
)

// Bearer Strategy check if token sent on request is valid (for auth)
passport.use(
    new BearerStrategy(
        async (token, done) => {
            try {
                const payload = jwt.verify(token, process.env.CHAVE_JWT) //get the payload, with usario.id though decode of JWT token
                const usuario = await Usuario.buscaPorId(payload.id)
                done(null, usuario)                
            } catch (error) {
                done(error)
            }
        }
    )
)