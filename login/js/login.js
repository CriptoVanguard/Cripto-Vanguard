
// Obtendo os elementos necessários
const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('password');

// Adicionando um evento de clique ao botão de mostrar/ocultar senha
togglePassword.addEventListener('click', function () {
    // Verifica o tipo atual do campo de senha
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;

    // Alterando o ícone do olho baseado na visibilidade da senha
    if (passwordField.type === 'password') {
        togglePassword.innerHTML = '👁️';  // Ícone de olho fechado
    } else {
        togglePassword.innerHTML = '🙈';  // Ícone de olho aberto
    }
});

// Opção para mostrar um alerta caso o formulário de login seja enviado sem os campos preenchidos
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Previne o envio do formulário

    const username = document.getElementById('username').value;
    const password = passwordField.value;

    // Verifica se os campos estão preenchidos
    if (username === '' || password === '') {
        // Exibe um alerta de erro usando o SweetAlert2
        Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Por favor, preencha todos os campos!',
        });
    } else {
        // Caso os campos estejam preenchidos, você pode enviar o formulário ou realizar outra ação
        // Exemplo: redirecionar para a página de dashboard
        Swal.fire({
            icon: 'success',
            title: 'Bem-vindo!',
            text: 'Você foi logado com sucesso.',
        }).then(() => {
            // Aqui você pode redirecionar o usuário após a autenticação
            window.location.href = "dashboard.html"; // Substitua com a URL de destino
        });
    }
});
