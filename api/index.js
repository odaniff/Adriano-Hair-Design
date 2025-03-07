// Arquivo principal da API (app)
import express from 'express'; 
const app = express(); // Inicializa o express
import morgan from 'morgan';
import cors from 'cors';
import busboy from 'connect-busboy';
import busboyBodyParser from 'busboy-body-parser';

import './database.js'; // Requerindo o arquivo de conexão com o banco de dados

// Com o nodemoon (instalado via yarn, iniciado no 'package.json') o servidor será iniciado automaticamente após salvar o arquivo.

// Middlewares
app.use(morgan('dev'));  //O morgan só será usado em ambiente de desenvolvimento
// app.use(busboy()); // O busboy é um middleware que permite a leitura de arquivos
app.use(busboyBodyParser()); // O busboyBodyParser é um middleware que permite a leitura de arquivos
app.use(express.json()); // O express.json() é um middleware que permite a leitura de dados em JSON
app.use(cors()); // O cors é um middleware que permite a comunicação entre servidores

// Variables 
app.set('port', process.env.PORT || 8000);

// Rotas
import adminRoutes from './src/routes/admin.routes.js';
app.use('/admin', adminRoutes);

import servicoRoutes from './src/routes/servico.routes.js';
app.use('/servicos', servicoRoutes);

import horarioRoutes from './src/routes/horario.routes.js';
app.use('/horarios', horarioRoutes);

import clienteRoutes from './src/routes/cliente.routes.js';
app.use('/clientes', clienteRoutes);

import agendamentoRoutes from './src/routes/agendamento.routes.js'
app.use('/agendamentos', agendamentoRoutes);

app.listen(app.get('port'), () => {
  console.log(`API ESTÁ ESCUTANDO ${app.get('port')}`);
});