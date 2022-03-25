import mongoose from "mongoose"

const autorSchema = new mongoose.Schema( // 1st Create a mongoose schema to represent the collection no db
    {
        id: { type: String},                        //
        nome: { type: String , required: true},     // 2nd describe collection fields
        nacionalidade: { type: String}              //
    },
    {
        versionKey: false                           // Disables version field on this collection
    }
)

const autores = mongoose.model('autores', autorSchema)     // Add Schema to mongoose

export default autores