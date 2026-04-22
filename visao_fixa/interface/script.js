if (localStorage.getItem("logado") !== "true") {
  window.location.href = "../login/login.html";
}

const usuarioNome = localStorage.getItem("usuarioAtualNome");
const usuarioEmail = localStorage.getItem("usuarioAtualEmail");
const savedTheme = localStorage.getItem("theme") || "light";

function applyTheme(theme) {
  document.body.classList.toggle("dark-mode", theme === "dark");
  localStorage.setItem("theme", theme);

  const themeLabel = document.querySelector(".theme-label");
  const themeIcon = document.getElementById("theme-icon");

  if (themeLabel) {
    themeLabel.innerText = theme === "dark" ? "Light Mode" : "Dark Mode";
  }

  if (themeIcon) {
    themeIcon.innerText = theme === "dark" ? "☀️" : "🌙";
  }
}

function toggleTheme() {
  const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
  applyTheme(currentTheme === "dark" ? "light" : "dark");
}

function showWelcomeAnimation() {
  if (localStorage.getItem("showWelcome") !== "true") return;
  if (!usuarioEmail) return;

  const welcomeOverlay = document.getElementById("welcome-overlay");
  const welcomeName = document.getElementById("welcome-name");

  if (!welcomeOverlay || !welcomeName) return;

  welcomeName.innerText = usuarioNome || "Usuário";
  welcomeOverlay.classList.add("active");
  localStorage.removeItem("showWelcome");

  setTimeout(() => {
    welcomeOverlay.classList.add("fade-out");
    const welcomeCard = welcomeOverlay.querySelector(".welcome-card");

    if (welcomeCard) {
      welcomeCard.classList.add("fade-out");
    }

    setTimeout(() => {
      welcomeOverlay.style.display = "none";
    }, 280);
  }, 1600);
}

function initProfileMenu() {
  const profileButton = document.getElementById("profile-button");
  const profileMenu = document.getElementById("profile-menu");
  const profileDot = document.getElementById("profile-dot");
  const profileName = document.getElementById("profile-user-name");
  const profileEmail = document.getElementById("profile-user-email");
  const themeToggle = document.getElementById("theme-toggle");
  const logoutButton = document.getElementById("logout-button");

  if (profileDot && usuarioNome) {
    profileDot.innerText = usuarioNome.charAt(0).toUpperCase();
  }

  if (profileName) {
    profileName.innerText = usuarioNome || "Usuário";
  }

  if (profileEmail) {
    profileEmail.innerText = usuarioEmail || "";
  }

  if (profileButton && profileMenu) {
    profileButton.addEventListener("click", function (event) {
      event.stopPropagation();
      profileMenu.classList.toggle("active");
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      toggleTheme();
      profileMenu.classList.remove("active");
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      localStorage.removeItem("logado");
      localStorage.removeItem("usuarioAtualNome");
      localStorage.removeItem("usuarioAtualEmail");
      window.location.href = "../login/login.html";
    });
  }

  document.addEventListener("click", function (event) {
    if (!profileMenu || !profileMenu.classList.contains("active")) return;
    if (!event.target.closest("#profile-button") && !event.target.closest("#profile-menu")) {
      profileMenu.classList.remove("active");
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  applyTheme(savedTheme);
  showWelcomeAnimation();
  initProfileMenu();
});

// garante que tem usuário
if (!usuarioEmail) {
  window.location.href = "../login/login.html";
}

// valores em CENTAVOS
let totais = JSON.parse(localStorage.getItem("totais_" + usuarioEmail)) || {
  "Assinaturas": 0,
  "Compras Online": 0,
  "Boletos": 0
};

function adicionarGasto() {
  const nome = document.getElementById("nome").value.trim();
  const valorInput = document.getElementById("valor").value.trim();
  const categoria = document.getElementById("categoria").value;

  if (!nome || !valorInput) {
    alert("Preencha todos os campos!");
    return;
  }

  // 🔥 converte para centavos corretamente
  const valor = Math.round(
    Number(valorInput.replace(",", ".")) * 100
  );

  if (isNaN(valor) || valor <= 0) {
    alert("Digite um valor válido!");
    return;
  }

  totais[categoria] += valor;

  salvar();
  atualizarTela();

  // limpar campos
  document.getElementById("nome").value = "";
  document.getElementById("valor").value = "";
}

// 💰 FORMATO BRASILEIRO CORRETO
function formatar(valor) {
  return (valor / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function atualizarTela() {
  document.getElementById("assinaturas-total").innerText =
    formatar(totais["Assinaturas"]);

  document.getElementById("compras-total").innerText =
    formatar(totais["Compras Online"]);

  document.getElementById("boletos-total").innerText =
    formatar(totais["Boletos"]);

  let total =
    totais["Assinaturas"] +
    totais["Compras Online"] +
    totais["Boletos"];

  document.getElementById("total-geral").innerText =
    formatar(total);

  document.getElementById("assinaturas-msg").innerText =
    totais["Assinaturas"] === 0 ? "Nenhum gasto ainda" : "Gastos registrados";

  document.getElementById("compras-msg").innerText =
    totais["Compras Online"] === 0 ? "Nenhum gasto ainda" : "Gastos registrados";

  document.getElementById("boletos-msg").innerText =
    totais["Boletos"] === 0 ? "Nenhum gasto ainda" : "Gastos registrados";
}

function salvar() {
  localStorage.setItem("totais_" + usuarioEmail, JSON.stringify(totais));
}

// carregar ao abrir
atualizarTela();