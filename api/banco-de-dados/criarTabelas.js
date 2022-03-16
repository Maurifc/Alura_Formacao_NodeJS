//Create table from a Model
//Run this manually from CLI: api/banco-de-dados/criarTabelas.js
const ModeloTabela = require('../rotas/fornecedores/ModeloTabelaFornecedor')

ModeloTabela.sync()
    .then(() => console.log('Tabela criada com sucesso'))
    .catch(console.log('Erro ao criar banco de dados'))