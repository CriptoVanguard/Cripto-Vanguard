// Obtendo os elementos necessários
const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('password');
console.log("Password field and toggle elements loaded.");

// Adicionando um evento de clique ao botão de mostrar/ocultar senha
togglePassword.addEventListener('click', function () {
    // Verifica o tipo atual do campo de senha
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;
    console.log(`Password field type changed to: ${passwordField.type}`);

    // Alterando o ícone do olho baseado na visibilidade da senha
    togglePassword.innerHTML = passwordField.type === 'password' ? '👁️' : '🙈';
});

// Opção para mostrar um alerta caso o formulário de login seja enviado sem os campos preenchidos
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async function (e) {
    e.preventDefault(); // Previne o envio do formulário
    console.log("Login form submission started.");

    const email = document.getElementById('email').value; // Mudando para email
    const password = passwordField.value;
    console.log(`User input - Email: ${email}, Password: ${password ? '****' : 'empty'}`);

    // Verifica se os campos estão preenchidos
    if (email === '' || password === '') {
        // Exibe um alerta de erro usando o SweetAlert2
        console.log("Form validation failed - missing email or password.");
        Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Por favor, preencha todos os campos!',
        });
    } else {
        console.log("Form validation passed, sending request to backend.");

        // Caso os campos estejam preenchidos, enviar os dados para autenticação no backend
        const response = await fetch('/api/login', { // Enviar login para backend (você deve implementar a rota no backend)
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }) // Enviar email e senha para o backend
        });

        console.log("Request sent to /api/login, waiting for response.");
        const data = await response.json();
        console.log("Response from backend received:", data);

        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Bem-vindo!',
                text: 'Você foi logado com sucesso.',
            }).then(() => {
                window.location.href = "dashboard.html"; // Substitua com a URL de destino
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: data.message || 'Falha no login, tente novamente.',
            });
        }
    }
});

// Função para exibir mensagens de sucesso ou erro usando SweetAlert
function showAlert(icon, title, text, redirectUrl = null) {
    console.log(`Alert triggered - ${title}: ${text}`);
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
    }).then(() => {
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    });
}

// Função para verificar o token de email na URL
window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const verified = urlParams.get('verified');
    const error = urlParams.get('error');

    console.log("Window loaded - Checking URL parameters:", { token, verified, error });

    // Verificando o token de verificação
    if (token) {
        try {
            console.log("Verifying email with token:", token);
            const response = await fetch(`/api/verify-email?token=${token}`, {
                method: 'GET',
            });

            const data = await response.json();
            console.log("Email verification response:", data);
            if (data.success) {
                showAlert('success', 'Sucesso!', data.message, 'login.html');
            } else {
                showAlert('error', 'Erro!', data.message);
            }
        } catch (error) {
            console.log("Error verifying email:", error);
            showAlert('error', 'Erro!', 'Erro ao verificar o e-mail. Tente novamente.');
        }
    }

    // Verificando o parâmetro 'verified' na URL (caso a verificação tenha sido bem-sucedida)
    if (verified) {
        showAlert('success', 'Sucesso!', 'Seu e-mail foi verificado com sucesso! Agora você pode fazer login.');
    }

    // Exibindo mensagem de erro caso haja o parâmetro 'error'
    if (error) {
        showAlert('error', 'Erro!', 'Houve um erro ao verificar o seu e-mail. Tente novamente.');
    }
};

// Código restante para o login (formulário de login etc.)
document.querySelector('#login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    console.log("Login form submit triggered.");

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    console.log(`User input - Email: ${email}, Password: ${password ? '****' : 'empty'}`);

    // Lógica para autenticação do usuário
    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => {
            console.log("Response received from /api/login.");
            return response.json();
        })
        .then(data => {
            console.log("Login response data:", data);
            if (data.success) {
                showAlert('success', 'Bem-vindo!', data.message, '/dashboard'); // Redireciona para o dashboard
            } else {
                showAlert('error', 'Erro!', data.message || 'Falha no login, tente novamente.');
            }
        })
        .catch(error => {
            console.error('Error during login process:', error);
            showAlert('error', 'Erro!', 'Houve um erro ao tentar fazer login.');
        });
});

// Exemplo de código para a requisição do token de verificação
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (token) {
    console.log(`Verifying email with token ${token}...`);
    // Fazer a requisição para verificar o email
    fetch(`/api/verify-email?token=${token}`)
        .then(response => response.json())
        .then(data => {
            console.log("Verification token response:", data);
            if (data.message) {
                if (data.message === 'Email verificado com sucesso!') {
                    Swal.fire({
                        title: 'Sucesso!',
                        text: data.message,
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    }).then(() => {
                        window.location.href = '/login';
                    });
                } else {
                    Swal.fire({
                        title: 'Erro!',
                        text: data.message,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                }
            }
        })
        .catch(error => {
            console.error('Erro ao verificar o e-mail:', error);
            Swal.fire({
                title: 'Erro!',
                text: 'Houve um problema ao tentar verificar seu e-mail.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        });
}
