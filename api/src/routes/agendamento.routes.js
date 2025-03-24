import express from 'express';
import mongoose from 'mongoose';
import moment from 'moment';
import {Agendamento} from '../models/agendamento.js'; // Importa o model Agendamento
import {Cliente} from '../models/cliente.js'; // Importa o model Cliente
import {Servico} from '../models/servico.js'; // Importa o model Servico
import {Horario} from '../models/horario.js'; // Importa o model Horario
import {Arquivos} from '../models/arquivos.js'; // Importa o model Arquivos
import utilFunctions from '../services/util.js'; // Importa as funçoes auxiliares 
import _ from 'lodash';

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
            $or: [  // Considerar alguma das condiçoes (ou)
                {
                    data_inicio: { $lt: fim},  // que, Começa antes do novo terminar (lt)=> less than-menor que
                    data_fim: {$gt: data_inicio},  // que, Termina depois do novo começar (gt)=> greater than-maior que
                },
            ],
        });
        
        if(existentAgendamento) { // se existir aborta e apresenta a mensagem do erro.
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

router.post('/filter', async(req,res) => { // Rota para filtrar agendamentos dentro de um periodo (do inicio do peimeiro dia do periodo, ao final do último dia do periodo)
    try {
        
        const { periodo } = req.body;

        const agendamentosFiltrados = await Agendamento.find({
            status: 'A',
            data_inicio: {
                $gte: moment(periodo.inicio).startOf('day'),  // Agendamentos que tem a data de inicio maior ou igual ao inicio do periodo 
                $lte: moment(periodo.final).endOf('day'),     // Agendamentos que tem a data de inicio menor ou igual ao fim do periodo
            },
        }).populate([  // O populate é para trazer os dados do cliente e do serviço
            {path: 'servicoID', select: 'titulo duracao valor'},
            {path: 'clienteID', select: 'nome telefone'},
        ]);

        res.json({error: false, agendamentosFiltrados})
    
    } catch (err) {
        res.json({ error: true, message: err.message });
    } 
});

router.post('/dias-disponiveis', async(req,res) => {
    try {
        const { data, servicoID } = req.body;

        let dataReq = moment(data);  // Converte a data da requisição string, para um objeto DATA moment.js
        let reqDia = dataReq.day(); // Retorna um número de 0 a 6 (domingo a sábado), que representa o dia da DATA 
        let agenda = []; // array vazio, para armazenar os dias disponíveis

        // Busca se existe um horário disponível para aquele serviço
        const horariosDisponiveis = await Horario.find({ 
            servicos: servicoID,  // Verifica se o servicoID da req está presente no array de servicos daquele horario
        }).select('servicos dias inicio fim');
        if(horariosDisponiveis.length === 0) { // Se não houver horários 
            return res.json({ error: true, message: "Não há horários disponíveis para esse serviço." });
        };


        // Busca o serviço do id da req 
        const servico = await Servico.findById(servicoID).select('titulo duracao');
        // TRANSFORMA A DURAÇAO DO SERVICO EM MIN PARA ESPAÇOS (SLOTS) DE 30 MIN
        const servicoSlots = utilFunctions.minutosParaSlots( 
            dataReq, // Hora de início do serviço
            moment(data).add(servico.duracao, 'minutes'), // Hora de término (início + duração em minutos)
            utilFunctions.SLOT_DURATION, // Duraçao fixa da cada slot (30 min - definida no util.js)
        ).length;    


        // PROCURA NOS PRÓXIMOS 365 DIAS ATÉ A AGENDA CONTER 7 DIAS DISPONÍVEIS
        for(let i=0; i<=365 && agenda.length<=7; i++) {
            let reqDia = dataReq.day(); // Atualiza o dia da semana conforme a data muda e retorna um número de 0 a 6 (domingo a sábado)
            
            const espacosValidos = horariosDisponiveis.filter((horario) => {
                // VERIFICAR SE O DIA DA SEMANA DA REQ ESTÁ CONTIDO NO ARRAY DE DIAS DOS HORÁRIOS DISPONÍVEIS
                const diaSemanaDisponivel = horario.dias.includes(reqDia);
                return diaSemanaDisponivel; // Se retornar FALSE esse dia não será adicionado à AGENDA
            });

            //  Se espacosValidos.length === 0, significa que nenhum horário está disponível nesse dia, então ele não adiciona esse dia na agenda e simplesmente passa para o próximo dia.
            if(espacosValidos.length > 0) {
                
                let todosHorariosDia = {};  

                for(let espaco of espacosValidos ){    // Para cada espaço disponível (dia que contém horário para o serviço e que contém o número do dia da semana)

                    // TRANSFORMA O ESPAÇO/HORÁRIO DO INÍCIO AO FIM EM SLOTS DE 30 MIN
                    todosHorariosDia = utilFunctions.minutosParaSlots(
                        utilFunctions.mergeDateTime(dataReq, espaco.inicio),  // Junta a data da req e o horário de início do atendimento
                        utilFunctions.mergeDateTime(dataReq, espaco.fim),  // Junta a data da req e o horário de término do atendimento
                        utilFunctions.SLOT_DURATION
                    );

                    // VERIFICAR HORÁRIOS JÁ OCUPADOS

                    // RECUPERAR AGENDAMENTOS DO  DIA
                    const agendamentos = await Agendamento.find({
                        status: 'A',
                        data_inicio: {
                            $gte: moment(dataReq).startOf('day'),  // Verifica se a data de início do agendamento é maior ou igual ao início do dia, a função startOf('day') retorna o início do dia
                            $lt: moment(dataReq).endOf('day')  // Verifica se a data de início do agendamento é menor que o final do dia, a função endOf('day') retorna o final do dia
                        },
                    }).select('data_inicio data_fim duracao_servico');
                    
                    // RECUPERAR HORÁRIOS OCUPADOS
                    let horariosOcupados = agendamentos.map((agendamento) => ({  // Mapeia os agendamentos e retorna um objeto com o horário de início e de fim
                        inicio: moment(agendamento.data_inicio).format('HH:mm'),
                        final: moment(agendamento.data_fim).format('HH:mm'),
                    }));
                        
                    
                    // FORMATAR HORÁRIOS OCUPADOS EM SLOTS
                    horariosOcupados = horariosOcupados.map((horario) => {  // Mapeia os horários ocupados e retorna os slots de 30 em 30 min
                        return utilFunctions.minutosParaSlots(
                            moment(horario.inicio, 'HH:mm'),
                            moment(horario.final, 'HH:mm'),
                            utilFunctions.SLOT_DURATION
                        )
                    }).flat();  // Transforma um array de arrays em um único array
    

                    // REMOVER TODOS OS HORÁRIOS OCUPADOS/SLOTS OCUPADOS
                    todosHorariosDia = todosHorariosDia.map((horarioLivre) => {  // Mapeia todos os horários do dia e retorna '-' para os horários ocupados
                        return horariosOcupados.includes(horarioLivre) ? '-' : horarioLivre;  // Se o horário livre estiver ocupado, retorna '-' senão retorna o horário livre (Ex.: 09:00)
                    });

                    // CRIA NOVOS ARRAYS DE SLOTS DE HORÁRIOS LIVRES E DIVIDE A CADA '-'
                    todosHorariosDia = utilFunctions.splitByValue(
                        todosHorariosDia,
                        '-',
                    );

                    // FILTRA OS ARRAYS QUE NÃO ESTÃO VAZIOS DIVIDIDOS ANTERIORMENTE PELO ('-'), OU SEJA, QUE CONTÉM HORÁRIOS LIVRES
                    todosHorariosDia = todosHorariosDia.filter((space) => space.length > 0);

                    // FILTRA OS ARRAYS QUE TEM TAMANHO MAIOR OU IGUAL AO TAMANHO DO SERVIÇO da req EM SLOTS
                    todosHorariosDia = todosHorariosDia.filter((horarios) => horarios.length >= servicoSlots);


                    // PRIMEIRAMENTE PERCORRE CADA SLOT DE todosHorariosDia
                    todosHorariosDia = todosHorariosDia.map((slot) => // O HORARIO CONTIDO NO FILTER É O ARRAY DE HORÁRIOS LIVRES
                        slot.filter((horario, index) => slot.length - index >= servicoSlots) // retorna o número de horários restantes a partir do índice atual. O slot.length - index é o tamanho do slot menos o index atual, se for maior ou igual ao tamanho do serviço, ele retorna o horário
                    ).flat(); // Transforma um array de arrays em um único array

                    todosHorariosDia = _.chunk(todosHorariosDia, 2);  // Divide o array em subarrays de 2 em 2 (Apenas para facilitar a formatação no front-end)

                    //  ADICIONAR O DIA NA AGENDA
                    agenda.push({
                        [dataReq.format('YYYY-MM-DD - dddd')]: todosHorariosDia // Adiciona ao array agenda o dataReq atual e todosHorariosDia transformados em slots de 30 em 30 min
                    });

                }
            };
            // Passa para o próximo dia
            dataReq = dataReq.add(1,'day'); // Passa para o próximo dia para verificá-lo

        };
        
        res.json({ error: false, titulo: servico.titulo, duracao: servico.duracao, servicoSlots, agenda });


    } catch (error) {
        res.json({ error: true, message: error.message });
    }
});

router.delete('/:id', async(req, res) => {  // Rota para alterar o status de um servico pelo ID, para 'E' (Excluído)
    try {

        // Atualiza o status do serviço no MongoDB
        const agendamentoExcluido = await Servico.findByIdAndUpdate(req.params.id, {status: 'E'}, {new: true});  // Busca e Atualiza o status do servico pelo ID
        res.json({ error: false, agendamentoExcluido});  // Retorna o servico excluído

    } catch (error) {
        res.json({error: true, message: error.message });  // Retorna o erro com o status 400
    }
});

export default router;