// As routes são responsáveis por receber as requisições HTTP 
// e chamar os models para realizar as operações no banco de dados. (Post, Get, Put, Delete) 'CRUD'
import express from 'express';
import {Admin} from '../models/admin.js'; // Importa o model Admin 

const router = express.Router();  // Cria um router para receber as requisições

router.post('/', async (req, res) => {  // Rota para criar um novo admin
    try {
        const admin = new Admin(req.body);  // Cria um novo admin com os dados do body da requisição
        await admin.save();  // Espera o admin ser salvo
        console.log(req.body);
        res.json({admin});  // Retorna o admin criado
    } catch (error) {
        console.log(error);
        res.status(400).send(error);  // Retorna o erro com o status 400
    }
}); 

export default router;  // Exporta o router para ser usado no arquivo principal da API

