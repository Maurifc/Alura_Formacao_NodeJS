const http = require("http")
const port = 3000


const rotas = {
    '/': 'Curso de node',
    '/livros': 'Entrei na página de livros',
    '/autores': 'Listagem de autores',
    '/editora': 'Página da editora',
    '/sobre': 'Info sobre o projeto'
}

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plan'})
    res.end(rotas[req.url])
})

server.listen(port, () => {
    console.log('Servidor escutando na porta http://localhost:' + port);
})