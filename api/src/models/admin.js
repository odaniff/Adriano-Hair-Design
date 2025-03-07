import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    // adminID: {
    //     type: mongoose.Types.ObjectId,
    //     required: true,                  o _id é gerado automaticamente pelo MongoDB
    //     unique: true,
    // },
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    senha: {
        type: String,
        required: true,
    },
    cpf: {
        type: String,
        required: true,
    },
    telefone: {
        type: String,
        required: true,
    },
    foto: {
        type: String,
        required: true,
    },
    dataNascimento: {
        type: String,
        required: true,
    },
    status : {
        type: String,
        required: true,
        enum: ['A', 'I', 'E'],
        default: 'A',
    },
    contaBancaria : {
        titular : {
            type: String,
            required: true,
        },
        cpfCnpj : {
            type: String,
            required: true,
        },
        banco: {
            type: String,
            required: true,
        },
        agencia : {
            type: String,
            required: true,
        },
        numero: {
            type: String,
            required: true,
        },
        tipo : {
            type: String,
            required: true,
        },
        digitoVerificador : {
            type: String,
            required: true,
        },
    },
    // recipientID é o ID do recebedor do admin no sistema de pagamentos
    recipientID: {
        type: String,
        required: true,
    },
    dataCadastro: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export const Admin = mongoose.model('Admin', adminSchema);

