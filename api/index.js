const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')
const roteador = require('./rotas/fornecedores')
const app = express()

app.use(bodyParser.json()) //  "Express Plugin"

// Declare a route and specify a router for it
app.use('/api/fornecedores', roteador)

// App start
app.listen(config.get('api.porta'), () => console.log('API está funcionando!'))