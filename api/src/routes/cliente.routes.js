import express from 'express';
import {Cliente} from '../models/cliente.js'; // Importa o model Cliente
import mongoose from 'mongoose';
import {AWSService} from '../services/aws.js'; // Importa o AWS
import {Arquivos} from '../models/arquivos.js'; // Importa o model Arquivos

const router = express.Router();

// router.post('/', async (req, res) => {
//     const db = mongoose.connection;  // Conexão com o banco de dados
//     const session = await db.startSession();  // Inicia uma sessão
//     session.startTransaction();         // Inicia uma transação
  
//     try {
        
//         let cliente = req.body; 
        
//         const existentClient = await Cliente.findOne({  // Verifica se o cliente já existe
//             $or: [  // O $or é um operador lógico que retorna verdadeiro se qualquer uma das expressões lógicas for verdadeira
//                 { email: cliente.email },  // Verifica se o email do cliente já existe
//                 { telefone: cliente.telefone },   // Verifica se o telefone do cliente já existe
//                 { documento: cliente.documento?.numero }, // Verifica se o documento do cliente já existe
//             ],
//         });

//         if (existentClient) {  // Se o cliente existir
//             await session.abortTransaction();
//             return res.json({ error: true, message: 'Cliente já cadastrado!' });
//         } 

//         if (!existentClient) {  // Se o cliente não existir  
            
//             // CRIA O CLIENTE NO MongoDB
//             cliente = await new Cliente(cliente).save();

//             await session.commitTransaction();
//             return res.json({ error: false, cliente});
//         }

//     } catch (err) {
//         await session.abortTransaction();
//         res.json({ error: true, message: err.message });
//     } finally {
//         session.endSession();
//     }

// }); ESSA ROTA NÃO ENVIA OS ARQUIVOS

router.post('/auth/cliente', async (req, res) => {  // Rota para LOGIN do cliente
    try {
        const { email, senha } = req.body;
        const cliente = await Cliente.findOne({ email, senha, status:"A" })

        if(cliente) {
            res.json({error:false, cliente})
        } else {
            res.json({error:true, message: "Nenhum cliente encontrado"});
        }

    } catch (error) {
        console.log(error);
        res.json({error:true, message: error.message});  // Retorna o erro com o status 400
    }
}); 

router.post('/', async (req, res) => {
    const db = mongoose.connection;  // Conexão com o banco de dados
    const session = await db.startSession();  // Inicia uma sessão
    session.startTransaction();         // Inicia uma transação
  
    try {
        
        let jsonCliente = JSON.parse(req.body.cliente);  // Pega os dados do body do JSON, SEM os files da requisição para criar um novo cliente
        
        const existentClient = await Cliente.findOne({  // Verifica se o cliente já existe
            $or: [  // O $or é um operador lógico que retorna verdadeiro se qualquer uma das expressões lógicas for verdadeira
                { email: jsonCliente.email },  // Verifica se o email do cliente já existe
                { telefone: jsonCliente.telefone },   // Verifica se o telefone do cliente já existe
                { documento: jsonCliente.documento.numero }, // Verifica se o documento do cliente já existe
            ],
        });

        if (existentClient) {  // Se o cliente existir
            await session.abortTransaction();
            return res.json({ error: true, message: 'Cliente já cadastrado!' });
        } 

        if (!existentClient) {  // Se o cliente não existir  
            
            let caminho = '';

            if (req.files && Object.keys(req.files).length > 1) {
                await session.abortTransaction();
                return res.json({ err: true, message: "Somente 1 foto." });
            }
            
            if (req.files && Object.keys(req.files).length > 0) {  // Se houver arquivos na requisição 

                const file = Object.values(req.files)[0];  // Acessa e pega o arquivo enviado na requisição

                const nameParts = file.name.split('.'); // Separa o nome do arquivo por '.' Ex> "Foto.jpg" nameParts = ["foto", "jpg"]
                const fileName = `${new Date().getTime()}.${  // Cria um nome para o arquivo com a data atual 
                    nameParts[nameParts.length - 1] // Pega a última parte do nome do arquivo original, que é a extensão do arquivo (.jpg) array começa em 0 então .lenght -1 (2-1=1), ou seja o segundo elemento do array q tem indice 1 
                }`;  

                const path = `clientes/${fileName}`; // Cria o caminho do arquivo no Amazon S3 com o nome que lhe foi criado

                const response = await AWSService.uploadToS3(  // Faz o upload do arquivo e do caminho para a Amazon S3
                    file,  // Arquivo
                    path  // Caminho 'clientes/filename'
                    //, acl = https://docs.aws.amazon.com/pt_br/AmazonS3/latest/dev/acl-overview.html
                );
            
                if (response.error) {
                    await session.abortTransaction();
                    session.endSession();
                    res.json({ error: true, message: response.message.message });
                }
                else {
                    caminho = path;
                }
            }

            // CRIA O CLIENTE NO MongoDB
            jsonCliente = await new Cliente(jsonCliente).save();

            // CRIAR ARQUIVO no MongoDB
            let arquivoSalvo = null;

            if (caminho) { // verifica se caminho tem um valor válido (ou seja, não é null, undefined ou uma string vazia)
                arquivoSalvo = await new Arquivos({
                    referenciaID: jsonCliente._id, // Referencia o ID do servico
                    model: 'Cliente', // Model Servico
                    URL: caminho, // URL do arquivo
                    }).save();
            }

            await session.commitTransaction();
            return res.json({ error: false, cliente: jsonCliente, arquivo: arquivoSalvo});
        }

    } catch (err) {
        await session.abortTransaction();
        res.json({ error: true, message: err.message });
    } finally {
        session.endSession();
    }

});

router.post('/filter', async (req, res) => {
    try {
        // const clienteFiltrados = [];

        const clientes = await Cliente.find(req.body.filters); // No body da requisição precisa ser passado assim: "filters" : {parametros que deseja filtrar Ex.: "endereco.cidade": "Brasília"}

        // for(let cliente of clientes) {
        //     const arquivo = await Arquivos.findOne({
        //         referenciaID: cliente._id,
        //         model: 'Cliente',
        //     });              
        //     clienteFiltrados.push({cliente, arquivo})
        // }   

        res.json({ error: false, clientes });

    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

router.get('/', async (req, res) => { // Rota para buscar todos os clientes ativos e inativos.
    try {
        const todosClientes = [];
        const clientes = await Cliente.find(); // Busca todos os clientes

        for(let cliente of clientes) { // Para cada cliente entre os encontrados
            const arquivo = await Arquivos.find({ // Busca o arquivo vinculado ao cliente
                referenciaID: cliente._id, // pelo id do cliente
                model: 'Cliente', // E com model Cliente
            });
            todosClientes.push({ cliente, arquivo }); // Adiciona o cliente e seu arquivo ao fim do array todosClientes
        }

        res.json({error: false, clientesEncontrados: todosClientes})

    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

router.get('/:id', async (req, res) => { // Rota para buscar cliente pelo ID
    try {

        const cliente = await Cliente.findOne({
            _id: req.params.id,         // Busca um cliente com o _id igual ao id da requisição
        }); 

        const arquivo = await Arquivos.find({ // Busca o arquivo vinculado ao cliente
            referenciaID: cliente._id, // pelo id do cliente
            model: 'Cliente', // E com model Cliente
        });

        res.json({error: false, cliente, arquivo}) // Retorna o cliente e seu arquivo

    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    
    const db = mongoose.connection;  // Conexão com o banco de dados
    const session = await db.startSession();  // Inicia uma sessão
    session.startTransaction();         // Inicia uma transação
    
    try {
        
        const { id } = req.params;  // Extrau o ID dos parâmetros da URL
        const cliente = req.body;  // Dados no body da requisição do cliente a ser atualizado 

        const existentClient = await Cliente.findOne({  // Verifica se o cliente já existe
            _id: { $ne: id },  // Exclui o próprio cliente da verificação (id diferentes do id do cliente) ESSENCIAL
            $or: [  // O $or é um operador lógico que retorna verdadeiro se qualquer uma das expressões lógicas for verdadeira
                { email: cliente.email },  // Verifica se o email do cliente já existe
                { telefone: cliente.telefone },   // Verifica se o telefone do cliente já existe
                { documento: cliente.documento?.numero }, // Verifica se o documento do cliente já existe ou é undefined/null
            ],
        });

        if (existentClient) {  // Se existir cliente com o email, telefone ou documento atualizado
            await session.abortTransaction();
            session.endSession();
            return res.json({ error: true, message: 'Cliente já cadastrado!' });
        } 

        else { // Se n existir cliente com o email telefone ou documento atualizado
            
            const clienteAtualizado = await Cliente.findByIdAndUpdate(id, cliente, {  // acha o cliente com o id igual o do param da requisição e atuliza o cliente com o body da req
                new:true, // Retorna o documento res.json com o Cliente já atualizado
                session,  // Usa a transação
                runValidators: true  // Valida os novos dados
            });

            const arquivo = await Arquivos.findOne({
                referenciaID : clienteAtualizado._id,
                model: 'Cliente'
            })

            await session.commitTransaction();
            session.endSession();
            res.json({ error: false, clienteAtualizado, arquivo }) // Responde a requisição com o cliente atualizado
        }


    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.json({ error: true, message: err.message });
    }
});

router.put('/ativar/:id', async (req, res) => {  // Ativa o cliente
    try {
        const clienteAtivo = await Cliente.findByIdAndUpdate(req.params.id, { status: 'A' }, {
            new: true,
            runValidators: true
        });
        res.json({ error: false, clienteAtivo });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

router.delete('/:id', async (req, res) => {  // Desativa o cliente
    try {
        const clienteInativo = await Cliente.findByIdAndUpdate(req.params.id, { status: 'I' }, {
            new: true,
            runValidators: true
        });
        res.json({ error: false, clienteInativo });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const clienteExcluido = await Cliente.findByIdAndDelete(req.params.id);
        res.json({ error: false, clienteExcluido });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

router.delete('/arquivo/delete/:id', async (req, res) => {  // Rota para deletar um arquivo de um serviço pelo ID
    try {
        
        // Deletar arquivo do MongoDB
        const arquivoDeletado = await Arquivos.findByIdAndDelete(req.params.id);  // Busca e deleta o arquivo pelo ID no MongoDB
        res.json({arquivoDeletado});  // Retorna o arquivo deletado
        
        // Deletar arquivo da Amazon S3
        await AWSService.deleteFileS3(arquivoDeletado.URL);  // Deleta o arquivo da Amazon S3 pelo caminho

    } catch (error) {
        res.json({ error: true, message: error.message });
    }
})

export default router;  // Exporta o router para ser usado no arquivo principal da API