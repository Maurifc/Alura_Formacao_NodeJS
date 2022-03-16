const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor') // Syntax sugar to ORM methods
const Fornecedor = require('./Fornecedor')

// Route /api/fornecedores
roteador.get('/', async (req, res) => {
    const resultados = await TabelaFornecedor.listar() // Same as model.findAll()
    res.send(
        JSON.stringify(resultados) // Turn list into json
    )
})

roteador.post('/', async (req, res) => {
    const dadosRecebidos = req.body
    const fornecedores = new Fornecedor(dadosRecebidos)

    await fornecedores.criar()

    res.send(JSON.stringify(fornecedores))
} )


roteador.get('/:idFornecedor', async (req, res) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })
        await fornecedor.carregar()
    
        res.send(JSON.stringify(fornecedor))
    } catch (error) {
        res.send(JSON.stringify({
            mensagem: error.message
        }))    
    }
})

module.exports = roteador