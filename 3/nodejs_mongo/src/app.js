import express from "express"
import db from "./config/dbConnect.js"
import livros from "./models/Livro.js"
import routes from "./routes/index.js"

// MongoDB
db.on("error", console.log.bind(console, "Erro de conexão"))
db.once("open", () => {
    console.log('Conexão com o banco realizada com sucesso!');
})

// Express init
const app = express()

// Routes setup
routes(app)

export default app