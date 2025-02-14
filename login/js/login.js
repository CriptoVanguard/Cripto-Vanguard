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
        try {
            const response = await fetch('https://cripto-vanguard.onrender.com/api/login', { // Certifique-se de usar a URL completa do seu backend
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }) // Enviar email e senha para o backend
            });

            console.log("Request sent to /api/login, waiting for response.");
            
            // Se o código de status da resposta for 200
            if (!response.ok) {
                console.error("Login request failed with status:", response.status);
                showAlert('error', 'Erro!', 'Falha ao autenticar. Tente novamente.');
                return;
            }

            const data = await response.json();
            console.log("Response from backend received:", data);

            if (data.success) {
                showAlert('success', 'Bem-vindo!', data.message, 'dashboard.html'); // Substitua com a URL de destino
            } else {
                showAlert('error', 'Erro!', data.message || 'Falha no login, tente novamente.');
            }
        } catch (error) {
            console.error("Error during login request:", error);
            showAlert('error', 'Erro!', 'Houve um erro ao tentar fazer login.');
        }
    }
});

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
function handleLoginResponse(response) {
    const notification = document.getElementById("notification");

    if (response.success) {
        notification.textContent = response.message; // Sucesso
        notification.classList.add("success");
        notification.classList.remove("error");
    } else {
        notification.textContent = response.message; // Erro
        notification.classList.add("error");
        notification.classList.remove("success");
    }

    // Exibe a notificação
    notification.style.display = "block";

    // Esconde após 5 segundos
    setTimeout(() => {
        notification.style.display = "none";
    }, 5000);
}

// Exemplo de chamada à API
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => handleLoginResponse(data))
    .catch(error => console.error('Erro:', error));
}
let attemptsLeft = 5;  // Número inicial de tentativas

loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = passwordField.value;

    if (email === '' || password === '') {
        Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Por favor, preencha todos os campos!',
        });
    } else {
        if (attemptsLeft <= 0) {
            showAlert('error', 'Erro!', 'Você excedeu o número de tentativas. Tente novamente mais tarde.');
            return;
        }

        try {
            const response = await fetch('https://cripto-vanguard.onrender.com/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                attemptsLeft--;  // Reduz o número de tentativas restantes
                console.log(`Tentativas restantes: ${attemptsLeft}`);
                showAlert('error', 'Erro!', 'Falha ao autenticar. Tente novamente.');
                return;
            }

            const data = await response.json();
            if (data.success) {
                showAlert('success', 'Bem-vindo!', data.message, 'dashboard.html');
            } else {
                attemptsLeft--;
                showAlert('error', 'Erro!', data.message || 'Falha no login, tente novamente.');
            }

            // Exibir tentativas restantes
            if (attemptsLeft > 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Tentativas Restantes',
                    text: `Você tem ${attemptsLeft} tentativas restantes.`,
                });
            }
        } catch (error) {
            showAlert('error', 'Erro!', 'Houve um erro ao tentar fazer login.');
        }
    }
});
