const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const roteador = require('./rotas/fornecedores')

app.use(bodyParser.json()) //  "Plugin"

// Routes
app.use('/api/fornecedores', roteador)

// App start
app.listen(config.get('api.porta'), () => console.log('API está funcionando!'))