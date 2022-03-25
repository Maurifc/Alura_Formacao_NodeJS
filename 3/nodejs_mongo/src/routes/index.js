import express from "express"
import livros from "./livrosRoutes.js"
import autores from "./autoresRoutes.js"

export default function routes(app) {
    app.route('/').get((req, res) => {
        res.status(200).send('Curso de node')
    })

    app.use(
        express.json(),
        livros,
        autores
    )
}