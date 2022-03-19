const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { InvalidArgumentError } = require('../erros')
const bcrypt = require('bcrypt')
const Usuario = require('./usuarios-modelo')

function verificaUsuario(usuario){
    if(!usuario)
        throw new InvalidArgumentError('Não existe suário com esse e-mail')
}

async function verificaSenha(senha, senhaHash){
    const senhaValida = await bcrypt.compare(senha, senhaHash)

    if(!senhaValida)
        throw new InvalidArgumentError('E-mail ou senha inválidos')

}

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'senha',
        session: false
    }, async (email, senha, done) => {
        try {
            const usuario = await Usuario.buscaPorEmail(email)
            verificaUsuario(usuario)   
            await verificaSenha(senha, usuario.senhaHash)
            done(null, usuario)
        } catch (error) {
            done(error)
        }
    })
)