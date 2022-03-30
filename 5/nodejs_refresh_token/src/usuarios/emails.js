const nodemailer = require('nodemailer')

class Email {

    async enviaEmail() {
        const contaTeste = await nodemailer.createTestAccount();

        const transportador = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            auth: contaTeste,
        });

        let info = await transportador.sendMail(this)

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