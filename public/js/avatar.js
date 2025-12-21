const bodySelect = document.getElementById("bodySelect");
const hairSelect = document.getElementById("hairSelect");
const faceSelect = document.getElementById("faceSelect");

const avatarBody = document.getElementById("avatarBody");
const avatarHair = document.getElementById("avatarHair");
const avatarFace = document.getElementById("avatarFace");

// Aggiorna anteprima
bodySelect.addEventListener("change", ()=>{ avatarBody.src = `images/avatars/body/${bodySelect.value}.png`; });
hairSelect.addEventListener("change", ()=>{ avatarHair.src = `images/avatars/hair/${hairSelect.value}.png`; });
faceSelect.addEventListener("change", ()=>{ avatarFace.src = `images/avatars/face/${faceSelect.value}.png`; });

// Salva avatar
function saveAvatar(){
  const avatarData = {
    body: bodySelect.value,
    hair: hairSelect.value,
    face: faceSelect.value
  };

  const username = localStorage.getItem("lunaris_user"); // memorizzato al login

  fetch("/saveAvatar",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({username, avatar: avatarData})
  })
  .then(res=>res.text())
  .then(msg=>alert("Avatar salvato!"))
  .catch(err=>alert("Errore: "+err));
}
