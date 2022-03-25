import express from "express";
import LivroController from "../controllers/livrosController.js";

const router = express.Router()

router
    .get('/livros', LivroController.listarLivros)
    .get('/livros/busca', LivroController.listarLivroPorEditora) // This route must come first than /livros/:id
    .get('/livros/:id', LivroController.listarLivroPorId)
    .post('/livros', LivroController.cadastrarLivro)
    .put('/livros/:id', LivroController.atualizarLivro)
    .delete('/livros/:id', LivroController.excluirLivro)

export default router