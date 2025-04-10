import mongoose from 'mongoose';

const agendamentoSchema = new mongoose.Schema({
    // agendamentoID: {
    //     type: mongoose.Types.ObjectId,
    //     required: true,                  o _id é gerado automaticamente pelo MongoDB
    //     unique: true,
    // },
    clienteID: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Cliente',
    },
    servicoID: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Servico',
    },
    nome_cliente: {
        type: String,
        required: true,
    },
    telefone_cliente: {
        type: String,
        required: true,
    },
    email_cliente: {
        type: String,
        required: true,
    },
    titulo_servico: {
        type: String,
        required: true,
    },
    valor_servico: {
        type: Number,
        required: true,
    },
    duracao_servico: {
        type: Number, // Number, pois representa a duração em minutos
        required: true,
    },
    data_inicio: {
        type: Date,  // Horário de término do atendimento (Ex.: 2024-02-27T18:00:00.000Z)
        required: true,
    },
    data_fim: {
        type: Date,  // Horário de término do atendimento (Ex.: 2024-02-27T18:00:00.000Z)
    },
    status: {
        type: String,
        required: true,
        enum: ['A', 'I', 'E'],
        default: 'A',
    },
    dataCadastro: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

// Middleware para calcular 'fim' antes de salvar
agendamentoSchema.pre('save', function (next) {
    if (this.data_inicio && this.duracao_servico) { // se exisitir data_inicio e duracao_servico
        this.data_fim = new Date(this.data_inicio.getTime() + this.duracao_servico * 60000); // Soma o inicio com a duracao para obter o fim, e transforma milissegundos para minutos
    }
    next();
});

export const Agendamento = mongoose.model('Agendamento', agendamentoSchema);