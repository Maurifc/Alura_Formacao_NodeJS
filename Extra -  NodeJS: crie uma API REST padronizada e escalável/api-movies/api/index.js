const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// Botstrap
app.use(bodyParser.json())


// Route
app.get('/api/movies', (req, res) => {
    const movies = [
        { nome: 'A ilha do medo' },
        { nome: 'Efeito borboleta' },
        { nome: 'O preço do amanhã' }
    ]
    
    res.send(JSON.stringify(movies))
} )

// App
app.listen(3000, () => console.log('API server is running!!!'))