import express from 'express';
import mongoose from 'mongoose';
import {Agendamento} from '../models/agendamento.js'; // Importa o model Agendamento
import {Cliente} from '../models/cliente.js'; // Importa o model Cliente
import {Servico} from '../models/servico.js'; // Importa o model Servico
import {Horario} from '../models/horario.js'; // Importa o model Horario
import {Arquivos} from '../models/arquivos.js'; // Importa o model Arquivos

const router = express.Router();

router.post('/', async(req,res) => {
    const db = mongoose.connection;  // Conexão com o banco de dados
    const session = await db.startSession();  // Inicia uma sessão
    session.startTransaction();         // Inicia uma transação
    
    try {
        
        const { clienteID, servicoID } = req.body;

        const cliente = await Cliente.findById(clienteID).select('nome telefone email endereco');

        const servico = await Servico.findById(servicoID).select('titulo preco duracao');
    
        // CRIAR O AGENDAMENTOS
        let agendamento = await new Agendamento({
            ... req.body,  // Copia todos os valores do req.body e junta com o campo 'valor' 
            nome_cliente: cliente.nome,
            telefone_cliente: cliente.telefone,
            email_cliente: cliente.email, 
            titulo_servico: servico.titulo,          
            valor_servico: servico.preco,
            duracao_servico: servico.duracao,
        }).save({session});

        await session.commitTransaction();
        res.json({error: false, agendamento})
    
    } catch (err) {
        await session.abortTransaction();
        res.json({ error: true, message: err.message });
    } finally {
        session.endSession();
    }
});

export default router;