const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor') // Syntax sugar to ORM methods

// Route /api/fornecedores : 
roteador.use('/', async (req, res) => {
    const resultados = await TabelaFornecedor.listar() // Same as model.findAll()
    res.send(
        JSON.stringify(resultados)
    )
})

module.exports = roteador