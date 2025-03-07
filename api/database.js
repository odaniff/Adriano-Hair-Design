import mongoose from 'mongoose';

// Connect to the database mongodb Atlas
// Lembrar de adicionar o nome do banco de dados antes do ?retryWrites=true&w=majority
// Exemplo: mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://daniels2625:dbPassword262533@clusterdev.ctoul.mongodb.net/Adriano-Hair-Design?retryWrites=true&w=majority&appName=ClusterDev', {
    // useNewUrlParser: true,       // Essas opções também não serão usadas nas versões mais recentes
    // useUnifiedTopology: true,    // Essas opções também não serão usadas nas versões mais recentes
    // useCreateIndex: true,        ESTAVA DANDO ERRO PQ ESSAS OPÇÕES FORAM 
    // useFindAndModify: false,     RETIRADAS DAS VERSÕES MAIS RECENTES DO MONGOOSE E DO MONGODB
})

.then(() => 
    console.log('Database connected'))
.catch((error) =>
    console.log(error));