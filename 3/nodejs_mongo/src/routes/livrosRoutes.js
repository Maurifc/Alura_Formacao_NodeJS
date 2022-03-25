import express from "express";
import LivroController from "../controllers/livrosController.js";

const router = express.Router() // 1st get router from express

router
    .get('/livros', LivroController.listarLivros) // 2nd add routes
    .get('/livros/busca', LivroController.listarLivroPorEditora) // (This route must come first than /livros/:id)
    .get('/livros/:id', LivroController.listarLivroPorId)
    .post('/livros', LivroController.cadastrarLivro)
    .put('/livros/:id', LivroController.atualizarLivro)
    .delete('/livros/:id', LivroController.excluirLivro)

export default router // Export router ( name is arbitrary )