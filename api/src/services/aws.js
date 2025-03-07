// Arquivo que configura o serviço da Amazon S3 (bucket) para armazenar arquivos
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

// Configura o cliente S3
const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// file: O arquivo que será enviado para o S3.
//filename: O nome que o arquivo terá no S3.
//acl: O controle de acesso ao arquivo (opcional, com valor padrão 'public-read').
export const uploadToS3 = (file, filename, acl = 'public-read') => {
    return new Promise((resolve, reject) => {  // Retorna uma Promise, resolve é chamado quando a Promise é resolvida e reject quando é rejeitada
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME, // Nome do Bucket
        Key: filename,  // Nome do arquivo  
        Body: file.data,        // Dados do arquivo
        // ACL: acl,        // Acess Control (controle de acesso) Permissão de leitura
      };
  
      s3.upload(params, (err, data) => {
        if (err) {
          console.error(err);
          return resolve({ error: true, message: err });
        }
        console.log(data);
        return resolve({ error: false, message: data });
      });
    });
  };
  
export const deleteFileS3 = (filename) => {
return new Promise((resolve, reject) => {
    const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename, // Caminho do arquivo no S3
    };

    s3.deleteObject(params, (err, data) => {
    if (err) {
        console.error(err);
        return resolve({ error: true, message: err });
    }
    console.log(data);
    return resolve({ error: false, message: data });
    });
});
};

export const AWSService = {
    uploadToS3,
    deleteFileS3
};