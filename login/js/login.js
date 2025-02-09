// Adicionando o evento de submit no formulário
document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('loginForm'); // Obtendo o formulário de login

    // Adicionando o evento de submit
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o comportamento padrão de envio do formulário
        
        // Obtendo os valores dos campos de entrada
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Validação dos campos de entrada
        if (username === "" || password === "") {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Por favor, preencha todos os campos!',
            });
            return; // Não prossegue se algum campo estiver vazio
        }

        // Simulação de um processo de login bem-sucedido
        if (username === "admin" && password === "senha123") {
            Swal.fire({
                icon: 'success',
                title: 'Login Bem-sucedido',
                text: 'Bem-vindo à Cripto Vanguard!',
            }).then(() => {
                window.location.href = 'dashboard.html'; // Redireciona para a página principal após o login
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Credenciais incorretas, tente novamente!',
            });
        }
    });
});
