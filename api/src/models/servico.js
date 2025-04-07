import mongoose from 'mongoose';

const servicoSchema = new mongoose.Schema({
    // servicoID: {
    //     type: mongoose.Types.ObjectId,
    //     required: true,                     o _id é gerado automaticamente pelo MongoDB
    //     unique: true,
    // },
    titulo: {
        type: String,
        required: true,
    },
    preco: {
        type: Number,
        required: true,
    },
    duracao: {
        type: Number, // Duração em minutos do serviço
        required: true,
    },
    descricao: {
        type: String,
        required: true,
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

export const Servico = mongoose.model('Servico', servicoSchema);