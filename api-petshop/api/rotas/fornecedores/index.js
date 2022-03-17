const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor') // Syntax sugar to ORM methods
const Fornecedor = require('./Fornecedor')

// Route /api/fornecedores
roteador.get('/', async (req, res) => {
    const resultados = await TabelaFornecedor.listar() // Same as model.findAll()
    res.status(200)
    res.send(
        JSON.stringify(resultados) // Turn list into json
    )
})

roteador.post('/', async (req, res, next) => {
    try {
        const dadosRecebidos = req.body
        const fornecedores = new Fornecedor(dadosRecebidos)
    
        await fornecedores.criar()
    
        res.status(201)
        res.send(JSON.stringify(fornecedores))        
    } catch (error) {
        next(error)      
    }
} )


roteador.get('/:idFornecedor', async (req, res, next) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })
        await fornecedor.carregar()
    
        res.status(200)
        res.send(JSON.stringify(fornecedor))
    } catch (error) {
        next(error)
    }
})

roteador.put('/:idFornecedor', async (req, res, next) => {
    try {
        const id = req.params.idFornecedor
        const dadosRecebidos = req.body
        const dados = Object.assign({}, dadosRecebidos, { id: id})
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()

        res.status(204)
        res.end()        
    } catch (error) {
       next(error)
    }
})

roteador.delete('/:idFornecedor', async (req, res, next) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({id})
        await fornecedor.carregar()
        fornecedor.remover()

        res.status(204)
        res.end()
    } catch (error) {
        next(error)
    }
})

module.exports = roteador