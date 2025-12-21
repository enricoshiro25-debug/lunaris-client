window.onload = function(){

  // Variabile globale temporanea per l'utente (da sostituire con login)
  const username = "prova";  // Cambia con username reale

  const bodySelect = document.getElementById("bodySelect");
  const hairSelect = document.getElementById("hairSelect");
  const faceSelect = document.getElementById("faceSelect");

  const avatarBody = document.getElementById("avatarBody");
  const avatarHair = document.getElementById("avatarHair");
  const avatarFace = document.getElementById("avatarFace");

  // Aggiorna anteprima al cambio selezione
  bodySelect.addEventListener("change", ()=>{ avatarBody.src = `images/avatars/body/${bodySelect.value}.png`; });
  hairSelect.addEventListener("change", ()=>{ avatarHair.src = `images/avatars/hair/${hairSelect.value}.png`; });
  faceSelect.addEventListener("change", ()=>{ avatarFace.src = `images/avatars/face/${faceSelect.value}.png`; });

  // Salva avatar sul server
  document.getElementById("saveAvatarBtn").addEventListener("click", ()=>{
    const avatarData = {
      body: bodySelect.value,
      hair: hairSelect.value,
      face: faceSelect.value
    };

    fetch("/saveAvatar",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({username, avatar: avatarData})
    })
    .then(res=>res.text())
    .then(msg=>alert("Avatar salvato!"))
    .catch(err=>alert("Errore: "+err));
  });

};
