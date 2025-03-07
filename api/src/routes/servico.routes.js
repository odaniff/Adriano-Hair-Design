// Arquivo responsável por criar as rotas para o model Servico
import express from 'express';
import {Servico} from '../models/servico.js'; // Importa o model Servico
import {AWSService} from '../services/aws.js'; // Importa o AWS
import {Arquivos} from '../models/arquivos.js'; // Importa o model Arquivos
import Busboy from 'busboy';

const router = express.Router();  // Cria um router para receber as requisições

// router.post('/', async (req, res) => {  // Rota para criar um novo servico
//     try {
//         const servico = new Servico(req.body);  // Cria um novo servico com os dados do body da requisição
//         await servico.save();  // Espera o servico ser salvo
//         console.log(req.body);
//         res.json({servico});  // Retorna o servico criado
//     } catch (error) {
//         console.log(error);
//         res.status(400).send(error);  // Retorna o erro com o status 400
//     }
// });

// router.delete('/delete/:id', async (req, res) => {  // Rota para deletar um servico pelo ID
//     try {
//         const servico = await Servico.findByIdAndDelete(req.params.id);  // Busca e deleta o servico pelo ID
//         res.json({servico});  // Retorna o servico deletado
//     } catch (error) {
//         console.log(error);
//         res.status(400).send(error);  // Retorna o erro com o status 400
//     }
// });

// router.get('/inativos', async (req, res) => {  // Rota para buscar todos os servicos
//     try {
//         const servicos = await Servico.find({ status: 'I' });  // Busca todos os servicos
//         res.json(servicos);  // Retorna os servicos encontrados
//     } catch (error) {
//         console.log(error);
//         res.status(400).send(error);  // Retorna o erro com o status 400
//     }
// });


// router.get('/ativos', async (req, res) => {  // Rota para buscar todos os servicos ativos
//     try {
//         const servicos = await Servico.find({ 
//             status: 'A' // Busca os servicos com status 'A' (Ativo)
//         }). select('_id titulo'); // Retorna apenas o _id e o titulo dos servicos
        
//         // O plugin utilizado no Frontend espera um array de objetos com as chaves 'label' e 'value'
//         res.json({
//             servicos: servicos.map((s)=> ({ label: s.titulo, value: s._id })) // Retorna um array de objetos com as chaves 'label' e 'value'
//         });  
//   /*{
//     "servicos": [
//         {
//             "label": "Corte de Cabelo",
//             "value": "67b886f060abab7e607168e0"  Exemplo de retorno
//         }
//     ]
//     }*/

//     } catch (error) {
//         console.log(error);
//         res.status(400).send(error);  // Retorna o erro com o status 400
//     }
// });

router.post('/', async (req, res) => {  // Rota para criar um novo servico no endpoint /servicos
    // const bb = Busboy({ headers: req.headers });  // Cria um novo busboy para ler os arquivos
    // bb.on('finish', async() => {  // Quando o busboy terminar de ler os arquivos
        try {
            let errors = [];  //  armazenará possíveis erros no upload de arquivos.
            let arquivos = [];  // armazenará os caminhos dos arquivos que foram enviados na requisição.

            if (req.files && Object.keys(req.files).length > 0) {  // Se houver arquivos na requisição 
                for (let key of Object.keys(req.files)) {  // Para cada arquivo
                    
                    const file = req.files[key];  // Pega o arquivo
        
                    const nameParts = file.name.split('.'); // Separa o nome do arquivo por '.'
                    const fileName = `${new Date().getTime()}.${  // Cria um nome para o arquivo com a data atual 
                        nameParts[nameParts.length - 1] // Pega a última parte do nome do arquivo original, que é a extensão do arquivo
                    }`;  
                    const path = `servicos/${fileName}`; // Cria o caminho do arquivo no Amazon S3
        
                    const response = await AWSService.uploadToS3(  // Faz o upload do arquivo e do caminho para a Amazon S3
                        file,  // Arquivo
                        path  // Caminho
                        //, acl = https://docs.aws.amazon.com/pt_br/AmazonS3/latest/dev/acl-overview.html
                    );
        
                    if (response.error) {
                        errors.push({ error: true, message: response.message.message });
                    } else {
                        arquivos.push(path);
                    }
                }
            }
        
            if (errors.length > 0) {  
                res.json(errors[0]);  // Retorna o erro no upload do arquivo
                return false;
            }
        
            // CRIAR SERVIÇO no MongoDB
            let jsonServico = JSON.parse(req.body.servico);  // Converte o JSON do body da requisição para um objeto 
            const servico = await new Servico(jsonServico).save();   // Cria um novo servico com os dados do body da requisição e salva no banco de dados
        
            // CRIAR ARQUIVO no MongoDB
            arquivos = arquivos.map((arquivo) => ({ // Mapeia os arquivos para criar um novo arquivo
                referenciaID: servico._id, // Referencia o ID do servico
                model: 'Servico', // Model Servico
                URL: arquivo, // URL do arquivo
            }));
            await Arquivos.insertMany(arquivos); // Insere os arquivos no banco de dados
            res.json({ error: false, servico, arquivos });  // Retorna os arquivos e o servico criado

        } catch (err) {
            res.json({ error: true, message: err.message });
        }
    // });
    // req.pipe(bb);  // Lê os arquivos da requisição
});  

router.get('/', async (req, res) => {  // Rota para buscar todos os servicos ativos e inativos, menos os excluídos
    try {
        const todosServicos = [];
        const servicos = await Servico.find({ status: {$ne: 'E'} });  // Busca todos os servicos com status diferente de 'E' (Excluído)
        
        for (let servico of servicos) {  // Para cada servico dentro dos servicos encontrados
            const arquivos = await Arquivos.find({  // Busca os arquivos
                referenciaID: servico._id,  // pelo ID do servico
                model: 'Servico',  // E com model Servico
            }); 
            todosServicos.push({ servico, arquivos });  // Adiciona o servico e os arquivos no array de todosServicos
        } 
        res.json({error: false, servicosEncontrados: todosServicos});  // Retorna os servicos encontrados

    } catch (error) {
        res.json({ error: true, message: err.message });  // Retorna o erro, se houver
    }
});

router.get('/testelabel', async (req, res) => {  // Rota para buscar todos os servicos Plugin FrontEnd
    try {
        const todosServicos = [];
        const servicos = await Servico.find({ status: {$ne: 'E'} });  // Busca todos os servicos com status diferente de 'E' (Excluído)
        
        for (let servico of servicos) {  // Para cada servico dentro dos servicos encontrados
            const arquivos = await Arquivos.find({  // Busca os arquivos
                referenciaID: servico._id,  // pelo ID do servico
                model: 'Servico',  // E com model Servico
            });
        } 
        res.json({
            servicos: servicos.map((s)=> ({ label: s.titulo, value: s._id })), // Retorna um array de objetos com as chaves 'label' e 'value'
        }); 
        
    } catch (error) {
        res.json({ error: true, message: err.message });  // Retorna o erro, se houver
    }
});

router.get('/:id', async (req, res) => {  // Rota para buscar um servico pelo ID
    try {
        const servico = await Servico.findOne({
            _id: req.params.id,  // Busca o servico pelo ID
            status: {$ne: 'E'},  // Com status diferente de 'E' (Excluído)
        });
        
        const arquivos = await Arquivos.find({  // Busca os arquivos
            referenciaID: servico._id,  // pelo ID do servico   
            model: 'Servico',  // E com model Servico
        });
        res.json({ servico, arquivos })

    } catch (error) {
        console.log(error);
        res.json({ error: true, message: err.message });
    }
});

router.put('/:id', async (req, res) => {  // Rota para atualizar um servico pelo ID
        try {
            let errors = [];  //  armazenará possíveis erros no upload de arquivos.
            let arquivos = [];  // armazenará os caminhos dos arquivos que foram enviados na requisição.

            if (req.files && Object.keys(req.files).length > 0) {  // Se houver arquivos na requisição 
                for (let key of Object.keys(req.files)) {  // Para cada arquivo
                  const file = req.files[key];  // Pega o arquivo
        
                  const nameParts = file.name.split('.'); // Separa o nome do arquivo por '.'
                  const fileName = `${new Date().getTime()}.${  // Cria um nome para o arquivo com a data atual 
                    nameParts[nameParts.length - 1] // Pega a última parte do nome do arquivo original, que é a extensão do arquivo
                  }`;  
                  const path = `servicos/${fileName}`; // Cria o caminho do arquivo no Amazon S3
        
                  const response = await AWSService.uploadToS3(  // Faz o upload do arquivo e do caminho para a Amazon S3
                    file,  // Arquivo
                    path  // Caminho
                    //, acl = https://docs.aws.amazon.com/pt_br/AmazonS3/latest/dev/acl-overview.html
                  );
        
                  if (response.error) {
                    errors.push({ error: true, message: response.message.message });
                  } else {
                    arquivos.push(path);  // Adiciona o caminho do arquivo no array de arquivos
                  }
                }
              }
        
              if (errors.length > 0) {  
                res.json(errors[0]);  // Retorna o erro no upload do arquivo
                return false;
              }
        
              // ATUALIZAR SERVIÇO no MongoDB
              let jsonServico = JSON.parse(req.body.servico); // Converte o JSON do body da requisição para um objeto
              const ServicoAtualizado = await Servico.findByIdAndUpdate(req.params.id, jsonServico, {new: true} );   // Atualiza o servico com os dados do body da requisição, o new: true retorna o servico atualizado
        
              // ADICIONAR ARQUIVO no MongoDB
              arquivos = arquivos.map((arquivo) => ({ // Mapeia os arquivos para criar um novo arquivo
                referenciaID: ServicoAtualizado.id, // Referencia o ID do servico
                model: 'Servico', // Model Servico
                URL: arquivo, // caminho do arquivo
              }));
              await Arquivos.insertMany(arquivos); // Insere os arquivos no banco de dados
              
              res.json({ error: false, ServicoAtualizado});
        } catch (err) {
            res.json({ error: true, message: err.message });
        }
    // });
    // req.pipe(bb);  // Lê os arquivos da requisição
});  

router.delete('/:id', async (req, res) => {  // Rota para alterar o status de um servico pelo ID, para 'E' (Excluído)
    try {

        // Atualiza o status do serviço no MongoDB
        const servicoExcluido = await Servico.findByIdAndUpdate(req.params.id, {status: 'E'}, {new: true});  // Busca e Atualiza o status do servico pelo ID
        res.json(servicoExcluido);  // Retorna o servico excluído

    } catch (error) {
        res.json({error: true, message: error.message });  // Retorna o erro com o status 400
    }
});

router.delete('/delete/:id', async (req, res) => {  // Rota para deletar um servico pelo ID
    try {

        // Deletar serviço do MongoDB
        const servicoDeletado = await Servico.findByIdAndDelete(req.params.id);  // Busca e deleta o servico pelo ID

        // Buscar e Deletar arquivos atrelados ao servicoDeletado da Amazon S3
        const arquivos = await Arquivos.find({ referenciaID: req.params.id });  // Busca os arquivos pelo ID do servico da requisição
        for (let arquivo of arquivos) {  // Para cada arquivo
            await AWSService.deleteFileS3(arquivo.URL);  // Deleta o arquivo da Amazon S3 pelo caminho
        }
        res.json({servicoDeletado, arquivosDeletados: arquivos});  // Retorna os arquivos deletados

    } catch (error) {
        res.json({error: true, message: error.message });  // Retorna o erro com o status 400
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