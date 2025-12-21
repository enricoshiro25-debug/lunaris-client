function register() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  if (!user || !pass) {
    alert("Compila tutto");
    return;
  }

  localStorage.setItem("user", user);
  localStorage.setItem("pass", pass);

  window.location.href = "creator.html";
}

