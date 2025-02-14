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
const rateLimit = require('express-rate-limit');

// Defina a regra para limitar tentativas de login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // número máximo de tentativas de login
    message: 'Você fez muitas tentativas. Tente novamente mais tarde.',
});

// Aplique o rate limiter na rota de login
app.post('/api/login', loginLimiter, async (req, res) => {
    // sua lógica de login aqui
});
let loginAttempts = 0;  // Exemplo de variável de controle

// Supondo que você tenha um limite de 5 tentativas
const maxAttempts = 5;

// Lógica de verificação de login:
if (loginAttempts >= maxAttempts) {
    res.status(403).json({ success: false, message: 'Número máximo de tentativas alcançado. Tente novamente mais tarde.' });
} else {
    // Lógica de verificação de senha...
}

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

// Função para gerar o token de verificação
function generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Rota de cadastro de usuário
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
        const verificationToken = generateVerificationToken();

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

// Rota para verificação de e-mail
app.get('/api/verify-email', async (req, res) => {
    const { token } = req.query;

    console.log('Token recebido:', token);

    if (!token) {
        console.log('Nenhum token recebido.');
        return res.status(400).json({ message: 'Token inválido ou ausente.' });
    }

    try {
        const query = 'SELECT id, token_verificacao, created_at FROM usuarios WHERE token_verificacao = $1';
        const result = await pool.query(query, [token]);

        if (result.rows.length === 0) {
            console.log('Usuário não encontrado para este token.');
            return res.status(404).json({ message: 'Token inválido ou expirado.' });
        }

        const user = result.rows[0];
        console.log('Usuário encontrado, ID:', user.id);

        // Verificar se o token expirou (aqui assumimos que o token tem validade de 1 hora)
        const tokenExpirationTime = 60 * 60 * 1000; // 1 hora em milissegundos
        const currentTime = new Date().getTime();
        const tokenCreatedTime = new Date(user.created_at).getTime();
        const tokenAge = currentTime - tokenCreatedTime;

        if (tokenAge > tokenExpirationTime) {
            console.log('Token expirado.');
            return res.status(400).json({ message: 'O token expirou. Solicite um novo.' });
        }

        // Atualizar o status de verificação do e-mail
        const updateQuery = 'UPDATE usuarios SET email_verificado = true, token_verificacao = NULL WHERE id = $1';
        const updateResult = await pool.query(updateQuery, [user.id]);

        if (updateResult.rowCount === 0) {
            console.log('Erro ao atualizar o status de verificação.');
            return res.status(500).json({ message: 'Erro ao verificar o e-mail.' });
        }

        console.log('Email verificado com sucesso!');

        res.redirect('https://criptovanguard.github.io/Cripto-Vanguard/login/login.html?verified=true');
    } catch (error) {
        console.error('Erro no backend ao verificar e-mail:', error);
        res.status(500).json({ message: 'Erro ao verificar e-mail.' });
    }
});




// Função de login de usuário
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

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

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

app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
});
