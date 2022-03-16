// Fornecedor Model. Describe fornecedor entity on database
const Sequelize = require('sequelize')
const instancia = require('../../banco-de-dados')

const colunas = {
    empresa: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    categoria: {
        type: Sequelize.ENUM('ração', 'brinquedos'),
        allowNull: false
    }
}

const opcoes = {
    freezeTableName: true,
    tableName: 'fornecedores',
    timestamps: true,
    createdAt: 'dataCriacao',
    updatedAt: 'dataAtualizacao',
    version: 'versao'
}

// Export a database instance properly setup with columns and options
module.exports = instancia.define('fornecedor', colunas, opcoes)