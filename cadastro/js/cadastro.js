// Seleciona todos os botões de alternância de senha
document.querySelectorAll('.toggle-password').forEach((button) => {
    button.addEventListener('click', () => {
        const input = button.previousElementSibling;
        const icon = button.querySelector('i');

        if (input) {
            input.type = input.type === 'password' ? 'text' : 'password';
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        }
    });
});

// Função para verificar a força da senha
function verificarForcaSenha(senha) {
    let forca = 0;

    if (senha.length >= 8) forca++;
    if (/\d/.test(senha)) forca++;
    if (/[a-z]/.test(senha)) forca++;
    if (/[A-Z]/.test(senha)) forca++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(senha)) forca++;

    return forca;
}

// Atualiza a força da senha no frontend
const senhaInput = document.getElementById('senha');
const senhaStrengthDiv = document.getElementById('password-strength');

if (senhaInput && senhaStrengthDiv) {
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
}

// Formulário de cadastro
const form = document.getElementById('cadastroForm');

if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o envio tradicional do formulário

        // Obtendo os dados do formulário
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const confirmarSenha = document.getElementById('confirmarSenha').value.trim();
        const termos = document.getElementById('termos')?.checked || false;

        // Validações básicas
        if (!nome || !email || !senha || !confirmarSenha) {
            alert('Todos os campos são obrigatórios.');
            return;
        }

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }

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
                    username: nome,
                    email,
                    senha,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Erro no cadastro');
            }

            alert('Cadastro realizado com sucesso!');
            window.location.href = '/login/login.html'; // Redireciona após o cadastro bem-sucedido
        } catch (error) {
            console.error('Erro ao enviar dados para o backend:', error);
            alert(error.message || 'Erro ao tentar se comunicar com o servidor');
        }
    });
}

// Função alternativa para alternar a visibilidade da senha
function togglePasswordVisibility(id) {
    const passwordField = document.getElementById(id);
    if (passwordField) {
        passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
    }
}
