import express from "express"
import db from "./config/dbConnect.js"
import routes from "./routes/index.js"                              // Imports routes

// MongoDB
db.on("error", console.log.bind(console, "Erro de conexão"))        // add callback to handle when connecting to mongodb 
db.once("open", () => {                                             // add callback to print message when database connects
    console.log('Conexão com o banco realizada com sucesso!');
})

// Express init
const app = express()

// Routes setup
routes(app)                                                         // attach routes to app

export default app