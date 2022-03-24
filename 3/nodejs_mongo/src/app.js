import express from "express"
import db from "./config/dbConnect.js"
import livros from "./models/Livro.js"

// MongoDB
db.on("error", console.log.bind(console, "Erro de conexão"))
db.once("open", () => {
    console.log('Conexão com o banco realizada com sucesso!');
})

const app = express()

app.use(express.json())

function buscaLivros(id){
    return livros.findIndex( livro => {
        return livro.id == id
    })
}

// const livros = [
//     {id: 1, titulo: "Senhos dos anéis"},
//     {id: 2, titulo: "O hobbit"}
// ]

app.get('/', (req, res) => {
    res.status(200).send('Curso de node')
})

app.get('/livros', (req, res) => {
   livros.find((err, livros) => {
        res.status(200).send(livros)
    })
})

app.get('/livros/:id', (req, res) => {
    const index = buscaLivros(req.params.id)
    res.json(livros[index])
})

app.post('/livros', (req, res) => {
    livros.push(req.body)
    res.status(201).send()
})

app.put('/livros/:id', (req, res) => {
    const index = buscaLivros(req.params.id)
    livros[index].titulo = req.body.titulo

    res.json(livros)
})

app.delete('/livros/:id', (req, res) => {
    let {id} = req.params
    const index = buscaLivros(id)
    livros[index].titulo = req.body.titulo

    livros.splice(index, 1) // Posição, Quantidade de item para excluir

    res.send('Livro removido com sucesso: '+ id)
})

export default app