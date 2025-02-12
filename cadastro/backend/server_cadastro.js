require('dotenv').config({ path: '/Users/programacao/Documents/Cripto_vanguard/cadastro/.env' });
console.log(process.env.DB_HOST); // Verifica se a variável DB_HOST foi carregada corretamente
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
    port: process.env.DB_PORT || 5432,
    ssl: {
        rejectUnauthorized: false // Para desabilitar a verificação do certificado SSL, necessário em alguns casos
    }
});

// Conexão com o banco de dados para testar
pool.connect()
    .then(() => console.log('Conectado ao banco de dados!'))
    .catch(err => {
        console.error('Erro ao conectar ao banco de dados', err.stack);
        process.exit(1); // Encerra o servidor caso a conexão falhe
    });

// Middleware
app.use(express.json());
app.use(cors());

// Rota de cadastro
app.post('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;
    
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
    }

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
