import autores from "../models/Autor.js"

class AutorController{
    static listarAutores = (req , res) => {
        autores.find((err, autores) => {
            res.status(200).send(autores)
        })
    }

    static listarAutorPorId = (req, res) => {
        let autor = autores.findById(req.params.id, (err, autores) => {
            if(err)
                return res.status(400).send({ message: 'Falha ao recuperar autor: ' + err.message})

            res.send(autores)          
        })

    }

    static cadastrarAutor = (req, res) => {
        let autor = new autores(req.body)
        autor.save((err) => {
            if(err)
                return res.status(500).send({ message: 'Falha ao cadastrar autor: ' + err.message})
            
            res.status(201).send(autor.toJSON())
        })
    }

    static atualizarAutor = (req, res) => {
        let autor = autores.findById(req.params.id)

        autor.updateOne({$set: req.body}, (err) => {
            if(err)
                return res.status(500).send({ message: err.message })

            res.send({ message: "Autor atualizado com sucesso" })
        })
    }

    static excluirAutor = (req, res) => {
        autores.findByIdAndDelete(req.params.id, (err) => {
            if(err)
                return res.status(500).send({ message: err.message })

            res.send({ message: 'Autor excluído com sucesso!'})
        })
    }
    
}

export default AutorController