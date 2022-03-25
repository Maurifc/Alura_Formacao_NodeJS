import livros from "../models/Livro.js"

class LivroController{
    static listarLivros = (req , res) => {
        livros.find()
            .populate('autor') // Injects autor on livro
            .exec((err, livros) => {
                res.status(200).send(livros)
            }
        )
    }

    static listarLivroPorId = (req, res) => {
        let livro = livros.findById(req.params.id)
            .populate('autor', 'nome')
            .exec((err, livros) => {
                if(err)
                    return res.status(400).send({ message: 'Falha ao recuperar livro: ' + err.message})

                res.send(livros)          
            }
        )

    }

    static cadastrarLivro = (req, res) => {
        let livro = new livros(req.body)
        livro.save((err) => {
            if(err)
                return res.status(500).send({ message: 'Falha ao cadastrar livro: ' + err.message})
            
            res.status(201).send(livro.toJSON())
        })
    }

    static atualizarLivro = (req, res) => {
        let livro = livros.findById(req.params.id)

        livro.updateOne({$set: req.body}, (err) => {
            if(err)
                return res.status(500).send({ message: err.message })

            res.send({ message: "Livro atualizado com sucesso" })
        })
    }

    static excluirLivro = (req, res) => {
        livros.findByIdAndDelete(req.params.id, (err) => {
            if(err)
                return res.status(500).send({ message: err.message })

            res.send({ message: 'Livro excluído com sucesso!'})
        })
    }

    static listarLivroPorEditora = (req, res) => {
        const editora = req.query.editora

        livros.find({ editora: editora}, {}, (err, livros) => {
            res.send(livros)
        })
    }
    
}

export default LivroController