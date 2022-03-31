const nodemailer = require('nodemailer')

const configuracaoEmailProducao = {
    host: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USUARIO,
        pass: process.env.EMAIL_SENHA
    },
    secure: true
}

const configuracaoEmailTeste = (contaTeste) => ({
    host: 'smtp.ethereal.email',
    auth: contaTeste
})

async function criaConfiguracaoEmail(){
    if(process.env.NODE_ENV === 'production'){
        return configuracaoEmailProducao
    } else{
        const contaTeste = await nodemailer.createTestAccount(); //Test account
        return configuracaoEmailTeste(contaTeste)
    }
}

class Email {
    async enviaEmail() {
        const configuracaoEmail = await criaConfiguracaoEmail()

        const transportador = nodemailer.createTransport(configuracaoEmail);

        let info = await transportador.sendMail(this)

        if(process.env.NODE_ENV !== 'production')
            console.log('URL: ' + nodemailer.getTestMessageUrl(info));
    }
}

class EmailVerificacao extends Email {
    constructor(usuario, endereco) {
        super()
        this.from = '"Blog do Código" <noreply@blogdocodigo.com.br>'
        this.to = usuario.email
        this.subject = 'Verificação de e-mail'
        this.text = `Olá! Verifique seu e-mail aqui: ${endereco}`
        this.html = `<h2>Olá!</h2> Olá! Verifique seu e-mail aqui: <a href="${endereco}"></a>`
    }
}


module.exports = { EmailVerificacao }