const nodemailer = require('nodemailer');
require('dotenv').config();  // Carrega as variáveis de ambiente do arquivo .env

// Criação do transportador de e-mail usando as credenciais do .env
const transporter = nodemailer.createTransport({
    service: 'gmail', // Pode usar outro serviço de e-mail se necessário
    auth: {
        user: process.env.EMAIL_USER, // E-mail configurado no .env
        pass: process.env.EMAIL_PASS, // Senha do App configurada no .env
    },
});

// Função para enviar o e-mail de verificação
async function sendVerificationEmail(email, token) {
    const verificationLink = `https://criptovanguard.github.io/Cripto-Vanguard/login/verify.html?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verifique sua conta no Cripto Vanguard',
        html: `
            <h2>Bem-vindo ao Cripto Vanguard!</h2>
            <p>Por favor, clique no link abaixo para verificar sua conta:</p>
            <a href="${verificationLink}">Verificar conta</a>
            <p>Se você não solicitou este e-mail, ignore-o.</p>
        `,
    };

    try {
        // Envia o e-mail de verificação
        await transporter.sendMail(mailOptions);
        console.log('✅ E-mail de verificação enviado!');
    } catch (error) {
        console.error('❌ Erro ao enviar o e-mail:', error);
    }
}

// Teste de envio de e-mail
sendVerificationEmail('criptovanguard1@gmail.com', 'exemplo-token-de-teste');
