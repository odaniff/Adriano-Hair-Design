// Arquivo responsável por criar as rotas para o model Horario
import express from 'express';
import {Horario} from '../models/horario.js'; // Importa o model Horario
import {AWSService} from '../services/aws.js'; // Importa o AWS
import {Arquivos} from '../models/arquivos.js'; // Importa o model Arquivos
import Busboy from 'busboy';

const router = express.Router();  // Cria um router para receber as requisições

router.post('/', async (req, res) => {  // Rota para criar um novo horário
    try {
        const horario = await new Horario(req.body).save(); // Cria um novo horário com os dados do body da requisição
        res.json({ horario })
    } catch (error) {
        res.json({ error: true, message: error.message})
    }
})

router.get('/', async (req,res) => {  // Rota para buscar todos os horários
    try {
        const horarios = await Horario.find(); // Busca todos os horários
        res.json({ horarios }); // Retorna os horários
    } catch (error) {
        res.json({ error: true, message: error.message });
    }
})

router.get('/:id', async (req,res) => {  // Rota para buscar um horário pelo ID
    try {
        const { id } = req.params; // Pega o ID da requisição
        const horario = await Horario.findById(id); // Busca o horário pelo ID
        res.json({ horario }); // Retorna o horário
    } catch (error) {
        res.json({ error: true, message: error.message });
    }
})

router.put('/:id', async (req,res) => {  // Rota para atualizar um horário pelo ID
    try {
        const { id } = req.params; // Pega o ID da requisição
        const horario = req.body; // Pega os dados do body da requisição para atualizar o horário
        const horarioAtualizado = await Horario.findByIdAndUpdate(id, horario, { new: true }); // Atualiza o horário
        res.json({ horarioAtualizado }); // Retorna os horários
    } catch (error) {
        res.json({ error: true, message: error.message });
    }
})

router.delete('/:id', async (req,res) => {  // Rotar para deletar um horário pelo ID
    try {
        const { id } = req.params; // Pega o ID da requisição
        const horarioDeletado = await Horario.findByIdAndDelete(id, { new: true }); // Deleta o horário pelo ID
        res.json({ horarioDeletado }); // Retorna o horário deletado
    } catch (error) {
        res.json({ error: true, message: error.message });
    }
})


export default router;  // Exporta o router para ser usado no arquivo principal da API