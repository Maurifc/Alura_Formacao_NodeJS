import mongoose from "mongoose"

const livroSchema = new mongoose.Schema(
    {
        id: {type: String},
        titulo: {type: String, required: true},
        autor: {type: mongoose.Schema.Types.ObjectId, ref: 'autores', required: true}, // References author
        editora: {type: String, required: true},
        numeroPaginas: {type: Number}
    }
)

const livros = mongoose.model('livros', livroSchema) // Creates a collection called Livros with schema livroSchema

export default livros