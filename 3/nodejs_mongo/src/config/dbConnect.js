import mongoose from "mongoose"

mongoose.connect("mongodb+srv://alucard:alucard@cluster0.vyqxo.mongodb.net/alura-node") // Connect to database

let db = mongoose.connection;

export default db;  // Export db for use on