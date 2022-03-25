import express from "express"
import livros from "./livrosRoutes.js"
import autores from "./autoresRoutes.js"

export default function routes(app) { // 1st create a routes function
    app.route('/').get((req, res) => { // 2nd add root route
        res.status(200).send('Curso de node')
    })

    app.use(                
        express.json(),     // 3rd Add json parser to app
        livros,             // 4th add another routes from other files
        autores
    )
}