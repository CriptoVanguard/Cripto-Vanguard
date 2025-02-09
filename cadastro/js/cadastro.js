// Alternar visibilidade da senha
document.querySelectorAll(".toggle-password").forEach(button => {
    button.addEventListener("click", function () {
        let input = this.previousElementSibling;
        if (input.type === "password") {
            input.type = "text";
            this.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
        } else {
            input.type = "password";
            this.innerHTML = '<i class="fa-solid fa-eye"></i>';
        }
    });
});

// Verificar força da senha
document.getElementById("senha").addEventListener("input", function () {
    let senha = this.value;
    let barra = document.getElementById("password-strength");

    let forca = 0;
    if (senha.length >= 8) forca++;
    if (/[A-Z]/.test(senha)) forca++;
    if (/[a-z]/.test(senha)) forca++;
    if (/[0-9]/.test(senha)) forca++;
    if (/[\W]/.test(senha)) forca++;

    const cores = ["red", "orange", "yellow", "green", "darkgreen"];
    barra.style.width = `${forca * 25}%`;
    barra.style.background = cores[forca - 1] || "red";
});

// Validação do formulário
document.getElementById("cadastroForm").addEventListener("submit", function (event) {
    event.preventDefault();
    
    let senha = document.getElementById("senha").value;
    let confirmarSenha = document.getElementById("confirmarSenha").value;

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    alert("Cadastro realizado com sucesso!");
});
