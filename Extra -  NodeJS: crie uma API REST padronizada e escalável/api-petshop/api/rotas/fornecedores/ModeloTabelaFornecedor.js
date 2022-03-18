// Fornecedor Model. Describe fornecedor entity on database
const Sequelize = require('sequelize')
const instancia = require('../../banco-de-dados')

// Fields
const colunas = {
    empresa: { // empresa - string - not null
        type: Sequelize.STRING,
        allowNull: false
    },
    email: { // email - string - not null
        type: Sequelize.STRING,
        allowNull: false
    },
    categoria: { // empresa - enum (0 = racao, 1 = brinquedos) - not null
        type: Sequelize.ENUM('ração', 'brinquedos'),
        allowNull: false
    }
}

const opcoes = {
    freezeTableName: true, // ?
    tableName: 'fornecedores',
    timestamps: true,
    createdAt: 'dataCriacao', // Rename createdAt to dataCriacao
    updatedAt: 'dataAtualizacao', // Rename updatedAt to dataAtualizacao
    version: 'versao' // Rename version field
}

// Export a database instance properly setup with columns and options
module.exports = instancia.define('fornecedor', colunas, opcoes)