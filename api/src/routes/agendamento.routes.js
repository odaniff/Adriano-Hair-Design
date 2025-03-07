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
        
        const { clienteID, servicoID, data_inicio } = req.body;

        // Busca as informações do Cliente e do Serviço
        const cliente = await Cliente.findById(clienteID).select('nome telefone email endereco');
        const servico = await Servico.findById(servicoID).select('titulo preco duracao');
    
        if (!cliente || !servico) {
            await session.abortTransaction();
            return res.json({ error: true, message: "Cliente ou serviço não encontrado." });
        }

        const fim = new Date(new Date(data_inicio).getTime() + servico.duracao * 60000);  // fim do novo serviço

        const existentAgendamento = await Agendamento.findOne({     // busca no banco um agendamento existente
            $or: [
                {
                    data_inicio: { $lt: fim},  // que, Começa antes do novo terminar (lt)=> less than-menor que
                    data_fim: {$gt: data_inicio},  // que, Termina depois do novo começar (gt)=> greater than-maior que
                },
            ],
        });
        
        if(existentAgendamento) {
            await session.abortTransaction();
            return res.json({ error: true, message: "Já existe um agendamento neste horário." })
        }

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