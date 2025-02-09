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

// Validação do formulário antes de enviar
const cadastroForm = document.getElementById('cadastroForm');

cadastroForm.addEventListener('submit', (event) => {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const termos = document.getElementById('termos').checked;

    // Verificar se os campos estão preenchidos corretamente
    if (!nome || !email || !senha || !confirmarSenha) {
        alert('Por favor, preencha todos os campos!');
        event.preventDefault();
        return;
    }

    // Verificar se as senhas coincidem
    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        event.preventDefault();
        return;
    }

    // Verificar se os termos foram aceitos
    if (!termos) {
        alert('Você precisa aceitar os termos e a política!');
        event.preventDefault();
        return;
    }

    // Caso passe por todas as validações, o formulário será enviado
    alert('Cadastro realizado com sucesso!');
});
