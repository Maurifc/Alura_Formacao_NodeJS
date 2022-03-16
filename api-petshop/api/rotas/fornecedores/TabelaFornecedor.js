// Syntax sugar to model methods
const Modelo = require('./ModeloTabelaFornecedor')
module.exports = {
    listar (){
        return Modelo.findAll() // Returns all rows in table fornecedores
    },

    inserir(fornecedor){
        return Modelo.create(fornecedor)
    },

    async pegarPorId(id){
        const encontrado = await Modelo.findOne({
            where: {
                id: id
            }
        })

        if (!encontrado){
            throw new Error('Fornecedor não encontrado')
        }

        return encontrado
    }
}