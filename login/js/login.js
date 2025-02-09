// Função para alternar a visibilidade da senha
const togglePassword = document.querySelector('#togglePassword');
const passwordField = document.querySelector('#password');

togglePassword.addEventListener('click', function (e) {
    // Alterna o tipo da senha entre 'password' e 'text'
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);

    // Alterna o ícone do olho
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

// Função para validação simples do formulário de login
const loginForm = document.querySelector('#loginForm');

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();  // Previne o envio do formulário para validação manual

    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    if (username === "" || password === "") {
        // Se campos estiverem vazios, exibe um alerta
        Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Por favor, preencha todos os campos!',
        });
    } else {
        // Simula o login (na prática, você pode enviar a requisição para o backend aqui)
        Swal.fire({
            icon: 'success',
            title: 'Login bem-sucedido!',
            text: 'Bem-vindo à Cripto Vanguard!',
        }).then(() => {
            // Redireciona após login bem-sucedido
            window.location.href = '/dashboard';  // Redirecionar para o painel ou página inicial
        });
    }
});

// Função para o link "Esqueceu a senha?"
const forgotPasswordLink = document.querySelector('#forgotPassword');

forgotPasswordLink.addEventListener('click', function (e) {
    e.preventDefault();  // Previne o comportamento padrão do link
    Swal.fire({
        title: 'Recuperar Senha',
        text: 'Digite seu e-mail para receber um link de recuperação de senha.',
        input: 'email',
        inputPlaceholder: 'Digite seu e-mail',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        preConfirm: (email) => {
            if (!email) {
                Swal.showValidationMessage('Por favor, insira um e-mail válido');
            } else {
                // Simula o envio do e-mail de recuperação
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 1000);
                });
            }
        },
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Link de recuperação enviado!', 'Verifique seu e-mail.', 'success');
        }
    });
});

// Função para o link "Não tem conta? Cadastre-se"
const registerLink = document.querySelector('#registerLink');

registerLink.addEventListener('click', function (e) {
    e.preventDefault();  // Previne o comportamento padrão do link
    Swal.fire({
        title: 'Cadastre-se',
        text: 'Redirecionando para a página de cadastro...',
        icon: 'info',
        timer: 2000,
        showConfirmButton: false
    }).then(() => {
        // Redireciona para a página de cadastro (substitua a URL conforme necessário)
        window.location.href = '/register';  // URL de cadastro
    });
});

