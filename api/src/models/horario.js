import mongoose, { Mongoose } from "mongoose";

const horarioSchema = new mongoose.Schema({
    // servicos é um ARRAY de ObjectIds que referenciam os serviços que estão disponíveis nesse horário
    servicos: [ 
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Servico',
        },
    ],
    dias : {
        type: [Number],  // Array de números que representam os dias da semana (0 = Domingo, ..., 6 = Sábado)
        required: true,
    },
    inicio: {
        type: Date,  // Horário de início do atendimento (Ex.: 2024-02-27T08:00:00.000Z)
        required: true,
    },
    fim: {
        type: Date,  // Horário de término do atendimento (Ex.: 2024-02-27T18:00:00.000Z)
        required: true,
    },
    datacadastro: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export const Horario = mongoose.model('Horario', horarioSchema);