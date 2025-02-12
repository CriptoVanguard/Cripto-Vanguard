// Toggle para mostrar/ocultar a senha
const togglePassword = document.querySelectorAll('.toggle-password');

togglePassword.forEach((button) => {
    button.addEventListener('click', () => {
        const input = button.previousElementSibling;
        const icon = button.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Função para verificar a força da senha
function verificarForcaSenha(senha) {
    let forca = 0;

    // Verificar comprimento
    if (senha.length >= 8) forca += 1;

    // Verificar se tem números
    if (/\d/.test(senha)) forca += 1;

    // Verificar se tem letras minúsculas
    if (/[a-z]/.test(senha)) forca += 1;

    // Verificar se tem letras maiúsculas
    if (/[A-Z]/.test(senha)) forca += 1;

    // Verificar se tem caracteres especiais
    if (/[!@#$%^&*(),.?":{}|<>]/.test(senha)) forca += 1;

    return forca;
}

// Mostrar a força da senha
const senhaInput = document.getElementById('senha');
const senhaStrengthDiv = document.getElementById('password-strength');

senhaInput.addEventListener('input', () => {
    const forca = verificarForcaSenha(senhaInput.value);
    let forcaTexto = '';

    if (forca === 0) {
        senhaStrengthDiv.textContent = '';
    } else if (forca <= 2) {
        senhaStrengthDiv.textContent = 'Senha Fraca';
        senhaStrengthDiv.style.color = 'red';
    } else if (forca === 3) {
        senhaStrengthDiv.textContent = 'Senha Média';
        senhaStrengthDiv.style.color = 'orange';
    } else {
        senhaStrengthDiv.textContent = 'Senha Forte';
        senhaStrengthDiv.style.color = 'green';
    }
});

// Formulário de cadastro
const form = document.getElementById('cadastroForm');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio tradicional do formulário

    // Obtendo os dados do formulário
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const termos = document.getElementById('termos').checked;

    // Verificando se as senhas coincidem
    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    // Verificando se o usuário aceitou os termos
    if (!termos) {
        alert('Você precisa aceitar os termos e política.');
        return;
    }

    // Enviando os dados para o backend
    try {
        const response = await fetch('https://cripto-vanguard.onrender.com/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome,
                email,
                senha
            }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
            window.location.href = '/login/login.html'; 
        } else {
            alert(data.message || 'Erro no cadastro');
            console.error('Erro no cadastro:', data);
        }
    } catch (error) {
        console.error('Erro ao enviar dados para o backend', error);
        alert('Erro ao tentar se comunicar com o servidor');
    }
    
});

// Função para alternar a visibilidade da senha
function togglePasswordVisibility(id) {
    const passwordField = document.getElementById(id);
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;
}
