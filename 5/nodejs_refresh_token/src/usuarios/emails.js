const nodemailer = require('nodemailer')

async function enviaEmail(usuario){
    const contaTeste = await nodemailer.createTestAccount();

    const transportador = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        auth: contaTeste,
    });

    let info = await transportador.sendMail({
        from: '"Blog do Código" <noreply@blogdocodigo.com.br>',
        to: usuario.email,
        subject: 'Teste de e-mail',
        text: 'Olá! Este é um e-mail de teste!',
        html: '<h2>Olá!</h2> <p> Este é um e-mail de teste!</p>'
    })

    console.log('URL: ' + nodemailer.getTestMessageUrl(info));
}

module.exports = { enviaEmail }