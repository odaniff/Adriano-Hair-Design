import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    // adminID: {
    //     type: mongoose.Types.ObjectId,
    //     required: true,                  o _id é gerado automaticamente pelo MongoDB
    //     unique: true,
    // },
    nome: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    senha: {
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

