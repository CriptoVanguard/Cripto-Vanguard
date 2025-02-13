const nodemailer = require('nodemailer');
require('dotenv').config();  // Carrega as variáveis de ambiente do arquivo .env

// Criação do transportador de e-mail usando as credenciais do .env
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Host do SMTP do Gmail
    port: 465, // Porta para conexões seguras (SSL)
    secure: true, // Usar SSL
    auth: {
        user: process.env.EMAIL_USER, // E-mail
        pass: process.env.EMAIL_PASS, // Senha do aplicativo
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
            <div style="font-family: 'Arial', sans-serif; background-color: #1e1e1e; color: #fff; padding: 30px; text-align: center;">
                <h1 style="color: #ffd700; font-size: 40px;">Cripto Vanguard</h1>
                <h2 style="font-size: 24px;">Bem-vindo ao futuro das criptomoedas!</h2>
                <p style="font-size: 18px;">Por favor, clique no botão abaixo para verificar sua conta e começar a negociar com segurança.</p>
                <a href="${verificationLink}" style="display: inline-block; background-color: #ffd700; color: #1e1e1e; padding: 15px 30px; font-size: 20px; font-weight: bold; text-decoration: none; border-radius: 5px; margin-top: 20px;">Verificar Conta</a>
                <p style="font-size: 14px; color: #ddd; margin-top: 30px;">Se você não solicitou este e-mail, por favor, ignore-o.</p>
                <div style="margin-top: 50px; font-size: 12px; color: #bbb;">
                    <p>Cripto Vanguard &copy; 2025 | Todos os direitos reservados.</p>
                </div>
            </div>
        `,
    };

    try {
        // Envia o e-mail de verificação
        await transporter.sendMail(mailOptions);
        console.log('✅ E-mail de verificação enviado!');
    } catch (error) {
        console.error('❌ Erro ao enviar o e-mail:', error);
        throw new Error('Erro ao enviar o e-mail de verificação');
    }
}

module.exports = { sendVerificationEmail };