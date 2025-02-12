require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,  // A porta padrão do PostgreSQL
});

// Conexão com o banco de dados para testar
pool.connect()
    .then(() => console.log('Conectado ao banco de dados!'))
    .catch(err => console.error('Erro ao conectar ao banco de dados', err.stack));

// Middleware
app.use(express.json());
app.use(cors());

// Rota de cadastro
app.post('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;
    
    // Inserir no banco de dados
    try {
        const query = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)';
        await pool.query(query, [nome, email, senha]);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
