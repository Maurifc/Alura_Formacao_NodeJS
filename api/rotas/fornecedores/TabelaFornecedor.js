// Syntax sugar to model methods
const Modelo = require('./ModeloTabelaFornecedor')
module.exports = {
    listar (){
        return Modelo.findAll() // Returns all rows in table fornecedores
    }
}