require('dotenv').config({ path: '/Users/programacao/Documents/Cripto_vanguard/cadastro/.env' });
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { sendVerificationEmail } = require('./email/sendEmail');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: 'https://criptovanguard.github.io',
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type',
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    ssl: { rejectUnauthorized: false },
});

pool.connect()
    .then(() => console.log('✅ Conectado ao banco de dados!'))
    .catch(err => {
        console.error('❌ Erro ao conectar ao banco de dados:', err.stack);
        process.exit(1);
    });

app.post('/cadastro', async (req, res) => {
    const { username, email, senha } = req.body;

    if (!username || !email || !senha) {
        return res.status(400).json({ success: false, message: 'Username, email e senha são obrigatórios.' });
    }

    try {
        const checkEmailQuery = 'SELECT id FROM usuarios WHERE email = $1';
        const existingUser = await pool.query(checkEmailQuery, [email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Este email já está registrado.' });
        }

        const hashedSenha = await bcrypt.hash(senha, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const novoUsuario = await pool.query(
            "INSERT INTO usuarios (username, email, password, token_verificacao) VALUES ($1, $2, $3, $4) RETURNING id",
            [username, email, hashedSenha, verificationToken]
        );

        console.log(`Novo usuário cadastrado: ${novoUsuario.rows[0].id}`);

        try {
            await sendVerificationEmail(email, verificationToken);
            res.status(201).json({
                success: true,
                message: 'Usuário cadastrado com sucesso! Confira seu e-mail para verificar sua conta.',
                userId: novoUsuario.rows[0].id
            });
        } catch (error) {
            console.error('Erro ao enviar e-mail de verificação:', error);
            res.status(500).json({ success: false, message: 'Erro ao enviar o e-mail de verificação.' });
        }
    } catch (err) {
        console.error('❌ Erro ao cadastrar usuário:', err.message);
        res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário.', error: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'E-mail e senha são obrigatórios.' });
    }

    try {
        const query = 'SELECT id, email, password, email_verificado FROM usuarios WHERE email = $1';
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'E-mail não encontrado.' });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Senha incorreta.' });
        }

        if (!user.email_verificado) {
            return res.status(400).json({ success: false, message: 'Por favor, verifique seu e-mail antes de fazer login.' });
        }

        const token = generateAuthToken(user.id);

        res.status(200).json({
            success: true,
            message: 'Login bem-sucedido.',
            token,
        });
    } catch (err) {
        console.error('Erro ao autenticar usuário:', err.message);
        res.status(500).json({ success: false, message: 'Erro ao autenticar usuário.' });
    }
});

function generateAuthToken(userId) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    return token;
}
app.get('/verify-email', async (req, res) => {
    const { token } = req.query;  // Recebe o token como parâmetro da URL

    if (!token) {
        return res.status(400).json({ success: false, message: 'Token inválido.' });
    }

    try {
        const query = 'SELECT id FROM usuarios WHERE token_verificacao = $1';
        const result = await pool.query(query, [token]);

        if (result.rows.length > 0) {
            // Token válido: atualize o status de verificação
            const userId = result.rows[0].id;
            const updateQuery = 'UPDATE usuarios SET email_verificado = TRUE, token_verificacao = NULL WHERE id = $1';
            await pool.query(updateQuery, [userId]);

            // Redireciona para a página de login
            res.json({
                success: true,
                message: 'E-mail verificado com sucesso!',
                redirectUrl: 'https://criptovanguard.github.io/Cripto-Vanguard/login/login.html'  // URL de redirecionamento para login
            });
        } else {
            // Token não encontrado ou inválido
            res.status(404).json({ success: false, message: 'Token inválido ou expirado.' });
        }
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        res.status(500).json({ success: false, message: 'Erro ao verificar token.' });
    }
});

app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
});
