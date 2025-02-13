// Função para alternar a visibilidade da senha
function togglePasswordVisibility(id) {
    const passwordField = document.getElementById(id);
    const passwordIcon = passwordField.nextElementSibling.querySelector('i'); // Seleciona o ícone dentro do botão
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text'; // Torna o campo visível
        passwordIcon.classList.remove('fa-eye');  // Altera o ícone
        passwordIcon.classList.add('fa-eye-slash'); // Ícone de senha oculta
    } else {
        passwordField.type = 'password'; // Torna o campo oculto
        passwordIcon.classList.remove('fa-eye-slash'); // Altera o ícone
        passwordIcon.classList.add('fa-eye'); // Ícone de senha visível
    }
}

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
const strengthMeter = document.getElementById('password-strength-meter'); // Seleciona a barra de força

if (senhaInput && senhaStrengthDiv && strengthMeter) {
    senhaInput.addEventListener('input', () => {
        const forca = verificarForcaSenha(senhaInput.value);
        let forcaTexto = '';

        // Atualiza o texto e a barra de força com base na senha
        if (forca === 0) {
            senhaStrengthDiv.textContent = '';
            strengthMeter.style.width = '0%';
            strengthMeter.style.backgroundColor = '#ff4d4d';
        } else if (forca <= 2) {
            senhaStrengthDiv.textContent = 'Senha Fraca';
            senhaStrengthDiv.style.color = 'red';
            strengthMeter.style.width = '25%';
            strengthMeter.style.backgroundColor = '#ffcc00';
        } else if (forca === 3) {
            senhaStrengthDiv.textContent = 'Senha Média';
            senhaStrengthDiv.style.color = 'orange';
            strengthMeter.style.width = '50%';
            strengthMeter.style.backgroundColor = '#ffcc00';
        } else {
            senhaStrengthDiv.textContent = 'Senha Forte';
            senhaStrengthDiv.style.color = 'green';
            strengthMeter.style.width = '75%';
            strengthMeter.style.backgroundColor = '#66cc33';
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
            Swal.fire({
                title: 'Erro!',
                text: 'Todos os campos são obrigatórios.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }

        if (senha !== confirmarSenha) {
            Swal.fire({
                title: 'Erro!',
                text: 'As senhas não coincidem!',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }

        if (!termos) {
            Swal.fire({
                title: 'Erro!',
                text: 'Você precisa aceitar os termos e política.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
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

            Swal.fire({
                title: 'Sucesso!',
                text: 'Cadastro realizado com sucesso!',
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then(() => {
                window.location.href = '/login'; // Redireciona após o cadastro bem-sucedido
            });

        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: error.message || 'Erro desconhecido!',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    });
}
