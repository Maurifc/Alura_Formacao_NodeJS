class CampoInvalido extends Error{
    constructor(campo){
        const message = `Campo inválido: ${campo}`
        super(message)

        this.name = 'CampoInvalido'
        this.message = this.message
        this.idErro = 1
    }
}

module.exports = CampoInvalido