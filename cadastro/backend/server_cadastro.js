require('dotenv').config({ path: '/Users/programacao/Documents/Cripto_vanguard/cadastro/.env' });
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { sendVerificationEmail } = require('./email/sendEmail');

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

        // Verificar se a senha fornecida corresponde à senha criptografada no banco
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Senha incorreta.' });
        }

        // Verificar se o e-mail foi verificado
        if (!user.email_verificado) {
            return res.status(400).json({ success: false, message: 'Por favor, verifique seu e-mail antes de fazer login.' });
        }

        // Se tudo estiver correto, autenticar o usuário (gerar um token JWT ou sessão)
        const token = generateAuthToken(user.id); // Implementar a função de geração do token

        res.status(200).json({
            success: true,
            message: 'Login bem-sucedido.',
            token,  // Retorna o token gerado
        });
    } catch (err) {
        console.error('Erro ao autenticar usuário:', err.message);
        res.status(500).json({ success: false, message: 'Erro ao autenticar usuário.' });
    }
});

// Função para gerar o token de autenticação (usando JWT)
function generateAuthToken(userId) {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    return token;
}





app.get('/api/verify-email', async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ success: false, message: 'Token inválido.' });
    }

    try {
        const query = 'SELECT id FROM usuarios WHERE token_verificacao = $1';
        const result = await pool.query(query, [token]);

        if (result.rows.length > 0) {
            console.log(`Token válido encontrado. Atualizando status de verificação para o usuário ${result.rows[0].id}.`);
            const updateQuery = 'UPDATE usuarios SET email_verificado = $1, token_verificacao = NULL WHERE id = $2';
            await pool.query(updateQuery, [true, result.rows[0].id]);

            // Após a verificação, redireciona para a página de login
            return res.json({
                success: true,
                message: 'Email verificado com sucesso!',
                redirectUrl: 'https://criptovanguard.github.io/Cripto-Vanguard/login/login.html'  // URL de redirecionamento para o login
            });
        } else {
            console.log(`Token não encontrado ou inválido: ${token}`);
            return res.status(404).json({ success: false, message: 'Token não encontrado ou inválido.' });
        }
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        return res.status(500).json({ success: false, message: 'Erro ao verificar o token.' });
    }
});

app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
});
