require('dotenv').config({ path: '/Users/programacao/Documents/Cripto_vanguard/cadastro/.env' });
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const { sendVerificationEmail } = require('./email/sendEmail'); // Verifique se esta função existe no seu código

const app = express();
const port = process.env.PORT || 3000;

// Configuração do CORS personalizada
const corsOptions = {
    origin: 'https://criptovanguard.github.io', // Permite apenas esta origem
    methods: 'GET,POST', // Métodos permitidos
    allowedHeaders: 'Content-Type', // Cabeçalhos permitidos
};

app.use(bodyParser.json());
app.use(cors(corsOptions)); // Aplica a configuração personalizada do CORS

// Configuração do banco de dados
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    ssl: { rejectUnauthorized: false },
});

// Testa a conexão com o banco
pool.connect()
    .then(() => console.log('✅ Conectado ao banco de dados!'))
    .catch(err => {
        console.error('❌ Erro ao conectar ao banco de dados:', err.stack);
        process.exit(1); // Encerra o servidor se não conectar ao banco
    });

// 🔹 Rota de cadastro
app.post('/cadastro', async (req, res) => {
    const { username, email, senha } = req.body;

    if (!username || !email || !senha) {
        return res.status(400).json({ success: false, message: 'Username, email e senha são obrigatórios.' });
    }

    try {
        // Verifica se o e-mail já está registrado
        const checkEmailQuery = 'SELECT id FROM usuarios WHERE email = $1';
        const existingUser = await pool.query(checkEmailQuery, [email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Este email já está registrado.' });
        }

        // Hasheia a senha antes de salvar no banco
        const hashedSenha = await bcrypt.hash(senha, 10);

        // Insere no banco de dados
        const novoUsuario = await pool.query(
            "INSERT INTO usuarios (username, email, password) VALUES ($1, $2, $3) RETURNING id",
            [username, email, hashedSenha]
        );

        // Gerar o token de verificação (pode ser mais complexo, como JWT)
        const token = Math.random().toString(36).substr(2); 

        // Enviar e-mail de verificação
        await sendVerificationEmail(email, token);

        res.status(201).json({ 
            success: true, 
            message: 'Usuário cadastrado com sucesso! Confira seu e-mail para verificar sua conta.', 
            userId: novoUsuario.rows[0].id 
        });

    } catch (err) {
        console.error('❌ Erro ao cadastrar usuário:', err.message);
        res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário.', error: err.message });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
});

// Rota de verificação de e-mail
app.get('/api/verify-email', async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ success: false, message: 'Token inválido.' });
    }

    try {
        // Aqui você pode procurar o token no banco de dados
        // Exemplo de query: verifique se o token corresponde ao usuário
        const query = 'SELECT id FROM usuarios WHERE token_verificacao = $1';
        const result = await pool.query(query, [token]);

        if (result.rows.length > 0) {
            // Atualize o status de verificação do usuário
            const updateQuery = 'UPDATE usuarios SET email_verificado = $1 WHERE id = $2';
            await pool.query(updateQuery, [true, result.rows[0].id]);

            return res.json({ success: true, message: 'Email verificado com sucesso!' });
        } else {
            return res.status(404).json({ success: false, message: 'Token não encontrado ou inválido.' });
        }
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        return res.status(500).json({ success: false, message: 'Erro ao verificar o token.' });
    }
});
