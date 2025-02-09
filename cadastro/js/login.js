document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const passwordStrengthBar = document.getElementById("passwordStrengthBar");
    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

    // Alternar visibilidade da senha
    function toggleVisibility(input, button) {
        if (input.type === "password") {
            input.type = "text";
            button.innerHTML = "🙈";
        } else {
            input.type = "password";
            button.innerHTML = "👁️";
        }
    }

    togglePassword.addEventListener("click", () => toggleVisibility(passwordInput, togglePassword));
    toggleConfirmPassword.addEventListener("click", () => toggleVisibility(confirmPasswordInput, toggleConfirmPassword));

    // Medidor de força da senha
    passwordInput.addEventListener("input", function () {
        const strength = calculateStrength(passwordInput.value);
        passwordStrengthBar.style.width = strength + "%";

        if (strength < 40) {
            passwordStrengthBar.classList.add("bg-danger");
        } else if (strength < 80) {
            passwordStrengthBar.classList.add("bg-warning");
        } else {
            passwordStrengthBar.classList.add("bg-success");
        }
    });

    function calculateStrength(password) {
        let strength = 0;
        if (password.length >= 6) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[^A-Za-z0-9]/.test(password)) strength += 40;
        return strength;
    }
});
