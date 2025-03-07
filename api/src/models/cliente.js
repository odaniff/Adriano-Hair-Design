import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
    // clienteID: {
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
    sexo : {
        type: String,
        required: true,
        enum: ["M", "F"],
    },
    foto : {
        type: String,
        required: true,
    },
    dataNascimento: {
        type: String,
        required: true,
    },
    endereco: {
        cep: {
            type: String,
            required: true,
        },
        cidade: {
        type: String,
        required: true,
        },
        UF: {
        type: String,
        required: true,
        },
        numero : {
        type: String,   
        required: true,
        },
        pais : {
        type: String,   
        required: true,
        },
    },
    status: {
        type: String,
        required: true,
        enum: ["A", "I"],
        default: "A",
    },
    documento : {
        tipo : {
            type: String,
            required: true,
            enum: ["CPF", "CNPJ"],
        },
        numero : {
            type: String,
            required: true,
        },
    },
    dataCadastro: {
        type: Date,
        required: true,
        default: Date.now,
    },
    });

    export const Cliente = mongoose.model("Cliente", clienteSchema);