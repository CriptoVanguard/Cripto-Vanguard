// Função para alternar a visibilidade da senha
function togglePasswordVisibility(id) {
    const passwordField = document.getElementById(id);
    const passwordIcon = passwordField?.nextElementSibling?.querySelector('i'); // Seleciona o ícone dentro do botão
    
    if (passwordField && passwordIcon) {
        if (passwordField.type === 'password') {
            passwordField.type = 'text'; // Torna o campo visível
            passwordIcon.classList.replace('fa-eye', 'fa-eye-slash'); // Alterna o ícone
        } else {
            passwordField.type = 'password'; // Torna o campo oculto
            passwordIcon.classList.replace('fa-eye-slash', 'fa-eye'); // Alterna o ícone
        }
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
const strengthMeter = document.getElementById('password-strength-meter');

if (senhaInput && senhaStrengthDiv && strengthMeter) {
    senhaInput.addEventListener('input', () => {
        const forca = verificarForcaSenha(senhaInput.value);
        let textoForca = '';
        let cor = '';
        let largura = '0%';

        switch (forca) {
            case 0:
                textoForca = 'Senha Muito Fraca';
                cor = '#ff4d4d';
                largura = '0%';
                break;
            case 1:
            case 2:
                textoForca = 'Senha Fraca';
                cor = 'red';
                largura = '25%';
                break;
            case 3:
                textoForca = 'Senha Média';
                cor = 'orange';
                largura = '50%';
                break;
            case 4:
                textoForca = 'Senha Boa';
                cor = 'yellow';
                largura = '75%';
                break;
            default:
                textoForca = 'Senha Forte';
                cor = 'green';
                largura = '100%';
                break;
        }

        senhaStrengthDiv.textContent = textoForca;
        senhaStrengthDiv.style.color = cor;
        strengthMeter.style.width = largura;
        strengthMeter.style.backgroundColor = cor;
    });
}

// Função para validar e-mail
function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

// Formulário de cadastro
const form = document.getElementById('cadastroForm');

if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o envio tradicional do formulário

        // Obtendo os dados do formulário
        const nome = document.getElementById('nome')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const senha = document.getElementById('senha')?.value.trim();
        const confirmarSenha = document.getElementById('confirmarSenha')?.value.trim();
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

        if (!validarEmail(email)) {
            Swal.fire({
                title: 'Erro!',
                text: 'O e-mail informado não é válido.',
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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro no cadastro');
            }

            // Exibe a mensagem de sucesso de cadastro
            Swal.fire({
                title: 'Sucesso!',
                text: 'Cadastro realizado com sucesso. Verifique seu e-mail para confirmar sua conta. Tão logo que o e-mail for enviado clica em verificar, e não fizer isso nunca vain conseguir acessar sua conta e vai ter de criar uma nova com novas credencias',
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then(() => {
                window.location.href = '/Cripto-Vanguard/login/login.html'; // Redireciona para o login
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
