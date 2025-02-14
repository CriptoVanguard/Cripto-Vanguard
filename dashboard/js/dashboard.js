// scripts.js

const API_URL = "https://cripto-vanguard.onrender.com/api";

// Carrega os dados do usuário diretamente do banco de dados via API
async function carregarDadosUsuario() {
    try {
        const response = await fetch(`${API_URL}/usuario`);
        if (!response.ok) throw new Error("Erro ao carregar dados do usuário");

        const usuario = await response.json();
        document.getElementById("user-name").innerText = usuario.nome;
        document.getElementById("user-email").innerText = usuario.email;
        atualizarSaldo(usuario.saldoUSDT, usuario.taxaConversao);
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        Swal.fire("Erro", "Falha ao carregar os dados do usuário!", "error");
    }
}

// Atualiza os saldos na interface
function atualizarSaldo(saldoUSDT, taxaConversao) {
    document.getElementById("balance-usdt").innerText = saldoUSDT.toFixed(2);
    document.getElementById("balance-aoa").innerText = (saldoUSDT * taxaConversao).toFixed(2);
}

// Função para depósito (envia a transação para o backend)
async function depositar() {
    const { value: valor } = await Swal.fire({
        title: "Depósito",
        input: "number",
        inputPlaceholder: "Digite o valor em USDT",
        showCancelButton: true,
        confirmButtonText: "Depositar"
    });

    if (!valor || isNaN(valor) || valor <= 0) {
        Swal.fire("Erro", "Digite um valor válido!", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/depositar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ valor: parseFloat(valor) })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.mensagem || "Erro ao depositar");

        atualizarSaldo(data.saldoUSDT, data.taxaConversao);
        Swal.fire("Sucesso!", `Você depositou ${valor} USDT`, "success");
    } catch (error) {
        console.error("Erro ao depositar:", error);
        Swal.fire("Erro", "Falha ao processar depósito!", "error");
    }
}

// Função para retirada (envia a transação para o backend)
async function levantar() {
    const { value: valor } = await Swal.fire({
        title: "Levantar",
        input: "number",
        inputPlaceholder: "Digite o valor em USDT",
        showCancelButton: true,
        confirmButtonText: "Levantar"
    });

    if (!valor || isNaN(valor) || valor <= 0) {
        Swal.fire("Erro", "Digite um valor válido!", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/levantar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ valor: parseFloat(valor) })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.mensagem || "Erro ao levantar");

        atualizarSaldo(data.saldoUSDT, data.taxaConversao);
        Swal.fire("Sucesso!", `Você levantou ${valor} USDT`, "success");
    } catch (error) {
        console.error("Erro ao levantar:", error);
        Swal.fire("Erro", "Falha ao processar retirada!", "error");
    }
}

// Função para compra de criptomoedas (pode ser implementada depois)
function comprar() {
    Swal.fire({
        title: "Compra de Criptomoeda",
        text: "Recurso em desenvolvimento!",
        icon: "info",
        confirmButtonText: "OK"
    });
}

// Inicia a página carregando os dados do usuário do backend
document.addEventListener("DOMContentLoaded", carregarDadosUsuario);
