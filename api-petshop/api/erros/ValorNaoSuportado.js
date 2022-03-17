class ValorNaoSuportado extends Error{
    constructor(contentType){
        super(`Content Type não suportado: ${contentType}`)
        this.name = 'ValorNaoSuportado'
        this.idErro = 3
    }
}

module.exports = ValorNaoSuportado