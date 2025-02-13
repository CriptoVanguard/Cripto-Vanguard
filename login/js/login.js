// Obtendo os elementos necessários
const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('password');

// Adicionando um evento de clique ao botão de mostrar/ocultar senha
togglePassword.addEventListener('click', function () {
    // Verifica o tipo atual do campo de senha
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;

    // Alterando o ícone do olho baseado na visibilidade da senha
    togglePassword.innerHTML = passwordField.type === 'password' ? '👁️' : '🙈';
});

// Opção para mostrar um alerta caso o formulário de login seja enviado sem os campos preenchidos
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async function (e) {
    e.preventDefault(); // Previne o envio do formulário

    const email = document.getElementById('email').value; // Mudando para email
    const password = passwordField.value;

    // Verifica se os campos estão preenchidos
    if (email === '' || password === '') {
        // Exibe um alerta de erro usando o SweetAlert2
        Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Por favor, preencha todos os campos!',
        });
    } else {
        // Caso os campos estejam preenchidos, enviar os dados para autenticação no backend
        const response = await fetch('/api/login', { // Enviar login para backend (você deve implementar a rota no backend)
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }) // Enviar email e senha para o backend
        });

        const data = await response.json();
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

    // Verificando o token de verificação
    if (token) {
        try {
            const response = await fetch(`/api/verify-email?token=${token}`, {
                method: 'GET',
            });

            const data = await response.json();
            if (data.success) {
                showAlert('success', 'Sucesso!', data.message, 'login.html');
            } else {
                showAlert('error', 'Erro!', data.message);
            }
        } catch (error) {
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
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    // Lógica para autenticação do usuário
    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('success', 'Bem-vindo!', data.message, '/dashboard'); // Redireciona para o dashboard
            } else {
                showAlert('error', 'Erro!', data.message || 'Falha no login, tente novamente.');
            }
        })
        .catch(error => {
            showAlert('error', 'Erro!', 'Houve um erro ao tentar fazer login.');
        });
});

// Exemplo de código para a requisição do token de verificação
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (token) {
    // Fazer a requisição para verificar o email
    fetch(`/api/verify-email?token=${token}`)
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                // Usar SweetAlert para mostrar a mensagem
                if (data.message === 'Email verificado com sucesso!') {
                    Swal.fire({
                        title: 'Sucesso!',
                        text: data.message,
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    }).then(() => {
                        // Você pode redirecionar ou realizar outra ação aqui
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
