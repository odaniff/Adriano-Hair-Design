// O Model Arquivos é utilizado para armazenar os arquivos da Amazon S3
import mongoose from 'mongoose';

const arquivosSchema = new mongoose.Schema({
    referenciaID: {
        type: mongoose.Types.ObjectId,  // Referencia a um ID de Cliente, Servico ou Admin    
        required: true,                 
        refPath: 'model',  // Referencia a model
    },
    model: {
        type: String,
        required: true,
        enum: ['Cliente', 'Servico', 'Admin'],
    },
    URL: {  // URL do arquivo na Amazon S3 
        type: String,
        required: true,
    },
    dataCadastro: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export const Arquivos = mongoose.model('Arquivos', arquivosSchema);