require('dotenv').config({ path: '/Users/programacao/Documents/Cripto_vanguard/cadastro/.env' });

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

// 🔹 Verifica se as variáveis de ambiente estão carregadas corretamente
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    console.error('Erro: Variáveis de ambiente do banco de dados não foram carregadas corretamente.');
    process.exit(1);
}

// 🔹 Configuração do banco de dados PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    ssl: { rejectUnauthorized: false } // Usado em hospedagens com SSL
});

// 🔹 Testa a conexão com o banco antes de iniciar o servidor
pool.connect()
    .then(() => console.log('✅ Conectado ao banco de dados!'))
    .catch(err => {
        console.error('❌ Erro ao conectar ao banco de dados:', err.stack);
        process.exit(1); // Encerra o servidor se não conectar ao banco
    });

// 🔹 Confirma se o backend está acessando o banco correto
pool.query('SELECT current_database();')
    .then(result => console.log('🔍 Conectado ao banco de dados:', result.rows[0].current_database))
    .catch(err => console.error('❌ Erro ao verificar banco de dados:', err.message));

// 🔹 Middleware
app.use(express.json());
app.use(cors());

// 🔹 Rota de cadastro
app.post('/cadastro', async (req, res) => {
    const { username, email, senha } = req.body;

    if (!username || !email || !senha) {
        return res.status(400).json({ success: false, message: 'Username, email e senha são obrigatórios.' });
    }

    try {
        // 🔹 Verifica se o email já está registrado
        const checkEmailQuery = 'SELECT id FROM usuarios WHERE email = $1';
        const existingUser = await pool.query(checkEmailQuery, [email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Este email já está registrado.' });
        }

        // 🔹 Hasheia a senha antes de salvar no banco
        const hashedSenha = await bcrypt.hash(senha, 10);

        // 🔹 Insere no banco de dados (corrigido: troca 'senha' para 'password')
        const novoUsuario = await pool.query(
            "INSERT INTO usuarios (username, email, password) VALUES ($1, $2, $3) RETURNING id",
            [username, email, hashedSenha]
        );

        res.status(201).json({ 
            success: true, 
            message: 'Usuário cadastrado com sucesso!', 
            userId: novoUsuario.rows[0].id 
        });

    } catch (err) {
        console.error('❌ Erro ao cadastrar usuário:', err.message);
        res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário.', error: err.message });
    }
});

// 🔹 Inicia o servidor
app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
});
