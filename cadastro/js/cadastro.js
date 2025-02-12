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


// Incluindo SweetAlert2
import Swal from 'sweetalert2';

// Função para exibir ou ocultar a senha
function togglePasswordVisibility(id) {
    const passwordField = document.getElementById(id);
    const passwordIcon = passwordField.nextElementSibling.querySelector('i');
    if (passwordField.type === "password") {
        passwordField.type = "text";
        passwordIcon.classList.remove('fa-eye');
        passwordIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = "password";
        passwordIcon.classList.remove('fa-eye-slash');
        passwordIcon.classList.add('fa-eye');
    }
}

// Função para calcular a força da senha
function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length > 6) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return strength;
}

// Exibe a barra de força de senha
document.getElementById('senha').addEventListener('input', function () {
    const password = this.value;
    const strength = calculatePasswordStrength(password);
    const strengthMeter = document.getElementById('password-strength');

    // Atualiza a barra de força com base na senha
    switch (strength) {
        case 0:
            strengthMeter.style.width = '0%';
            strengthMeter.style.backgroundColor = '#ff4d4d';
            break;
        case 1:
            strengthMeter.style.width = '25%';
            strengthMeter.style.backgroundColor = '#ffcc00';
            break;
        case 2:
            strengthMeter.style.width = '50%';
            strengthMeter.style.backgroundColor = '#ffcc00';
            break;
        case 3:
            strengthMeter.style.width = '75%';
            strengthMeter.style.backgroundColor = '#66cc33';
            break;
        case 4:
            strengthMeter.style.width = '100%';
            strengthMeter.style.backgroundColor = '#66cc33';
            break;
    }
});

// Função para enviar o formulário
document.getElementById('cadastroForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const userData = {
        username: nome,
        email: email,
        senha: senha
    };

    // Enviar dados para o backend
    fetch('https://cripto-vanguard.onrender.com/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: 'Sucesso!',
                text: data.message,
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then(() => {
                window.location.href = '/login/login.html'; // Redirecionar após sucesso
            });
        } else {
            Swal.fire({
                title: 'Erro!',
                text: data.message,
                icon: 'error',
                confirmButtonText: 'Tentar novamente'
            });
        }
    })
    .catch(error => {
        Swal.fire({
            title: 'Erro!',
            text: 'Erro ao enviar dados para o backend.',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    });
});
