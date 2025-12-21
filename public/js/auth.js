function register() {
  const username = document.getElementById("user").value;
  const password = document.getElementById("pass").value;

  fetch("/register",{
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({username,password})
  })
  .then(res=>res.text())
  .then(msg=>{
    alert(msg);
    if(msg==="Registrato!") window.location.href="creator.html";
  })
  .catch(err=>alert(err));
}

function login() {
  const username = document.getElementById("user").value;
  const password = document.getElementById("pass").value;

  fetch("/login",{
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({username,password})
  })
  .then(res=>{
    if(res.status===200) return res.json();
    else throw "Username o password errati";
  })
  .then(data=>{
    localStorage.setItem("lunaris_pg", JSON.stringify(data));
    window.location.href="ingresso.html";
  })
  .catch(err=>alert(err));
}

