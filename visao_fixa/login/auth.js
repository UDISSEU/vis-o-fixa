function mostrarCadastro() {
  document.getElementById("login").style.display = "none";
  document.getElementById("cadastro").style.display = "block";
}

function voltarLogin() {
  document.getElementById("login").style.display = "block";
  document.getElementById("cadastro").style.display = "none";
}

// 🧾 CADASTRAR
function cadastrar() {
  const nome = document.getElementById("cad-nome").value;
  const email = document.getElementById("cad-email").value;
  const pass = document.getElementById("cad-pass").value;
  const pass2 = document.getElementById("cad-pass2").value;

  if (!nome || !email || !pass || !pass2) {
    alert("Preencha todos os campos!");
    return;
  }

  if (pass !== pass2) {
    alert("As senhas não coincidem!");
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  let existe = usuarios.find(u => u.email === email);

  if (existe) {
    alert("Email já cadastrado!");
    return;
  }

  usuarios.push({ nome, email, pass });

  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  alert("Conta criada!");
  voltarLogin();
}

// 🔐 LOGIN
function login() {
  const email = document.getElementById("login-user").value;
  const pass = document.getElementById("login-pass").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  let encontrado = usuarios.find(u => u.email === email && u.pass === pass);

  if (!encontrado) {
    alert("Login inválido!");
    return;
  }

  localStorage.setItem("logado", "true");
  localStorage.setItem("usuarioAtualNome", encontrado.nome);
  localStorage.setItem("usuarioAtualEmail", encontrado.email);
  localStorage.setItem("showWelcome", "true");

  window.location.href = "../interface/index.html";
}