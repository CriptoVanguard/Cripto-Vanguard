require('dotenv').config({ path: '/Users/programacao/Documents/Cripto_vanguard/cadastro/.env' });
console.log(process.env.DB_HOST); // Verifica se a variável DB_HOST foi carregada corretamente
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');

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
    const { username, email, senha } = req.body;
    
    if (!username || !email || !senha) {
        return res.status(400).json({ message: 'Username, email e senha são obrigatórios.' });
    }

    try {
        // Verificando se o email já está registrado
        const checkEmailQuery = 'SELECT * FROM usuarios WHERE email = $1';
        const existingUser = await pool.query(checkEmailQuery, [email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Este email já está registrado.' });
        }

        // Hasheando a senha
        const hashedSenha = await bcrypt.hash(senha, 10);

        // Inserir no banco de dados
        const query = 'INSERT INTO usuarios (username, email, password) VALUES ($1, $2, $3)';
        await pool.query(query, [username, email, hashedSenha]);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err.message);
        res.status(500).json({ message: 'Erro ao cadastrar usuário.', error: err.message });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
