import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Connect to the database mongodb Atlas
// Lembrar de adicionar o nome do banco de dados antes do ?retryWrites=true&w=majority
// Exemplo: mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
mongoose.connect(process.env.DATABASE_URL)

.then(() => 
    console.log('Database connected'))
.catch((error) =>
    console.log(error));