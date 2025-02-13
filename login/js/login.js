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

// Função para verificar o token de email na URL
window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        try {
            const response = await fetch(`/api/verify-email?token=${token}`, {
                method: 'GET',
            });

            const data = await response.json();

            // Exibindo o SweetAlert com base na resposta da API
            Swal.fire({
                icon: data.success ? 'success' : 'error',
                title: data.success ? 'Sucesso!' : 'Erro!',
                text: data.message,
            }).then(() => {
                if (data.success) {
                    setTimeout(() => {
                        window.location.href = data.redirectUrl || 'login.html'; // Usar o redirectUrl retornado ou página padrão
                    }, 2000);
                }
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Erro ao verificar o e-mail. Tente novamente.',
            });
        }
    }
};

// Função para mostrar notificações genéricas
function showNotification(message) {
    // Usando SweetAlert2 para exibir notificações
    Swal.fire({
        icon: 'info',
        title: 'Notificação',
        text: message,
    });
}
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
    }).then(() => {
        if (data.redirectUrl) {
            window.location.href = data.redirectUrl;
        }
    });
}
fetch('/api/verify-email?token=' + token)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redireciona para a URL recebida na resposta
            window.location.href = data.redirectUrl;
        } else {
            alert(data.message); // Exibe a mensagem de erro, se houver
        }
    })
    .catch(error => {
        console.error('Erro ao verificar o e-mail:', error);
    });
