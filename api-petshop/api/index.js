const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')
const roteador = require('./rotas/fornecedores')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const formatosAceitos = require('./Serializador').formatosAceitos
const app = express()

app.use(bodyParser.json()) //  "Express Plugin"

// Entrypoint Middleware - Check if ContentType is supported
app.use((req, res, next) => {
    let formatoRequisitado = req.header('Accept') // Get ContentType from header

    // Set json as default contentType
    if(formatoRequisitado === '*/*')
        formatoRequisitado = 'application/json'

    // -1 = not found
    if(formatosAceitos.indexOf(formatoRequisitado) == -1){
        res.status(406)
        res.end()
        return        
    }
    
    res.setHeader('Content-Type', formatoRequisitado)
    next()
})

// Declare a route and specify a router for it
app.use('/api/fornecedores', roteador)

// Out Middleware - Handle errors
app.use((error, req, res, next) => {
    let status = 500
    if(error instanceof NaoEncontrado)
        status = 404
        
    if(error instanceof CampoInvalido || error instanceof DadosNaoFornecidos)
        status = 400
    
    if(error instanceof ValorNaoSuportado)
        status = 406

    res.status(status)
    res.send(JSON.stringify({
        mensagem: error.message
    }))
})

// App start
app.listen(config.get('api.porta'), () => console.log('API está funcionando!'))