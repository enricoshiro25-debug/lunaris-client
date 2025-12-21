function setBody(file) {
  document.getElementById("body").src =
    "images/avatar/body/" + file;
}

function setHair(file) {
  document.getElementById("hair").src =
    "images/avatar/hair/" + file;
}

function setOutfit(file) {
  document.getElementById("outfit").src =
    "images/avatar/outfits/" + file;
}

function savePG() {
  const pg = {
    body: body.src,
    hair: hair.src,
    outfit: outfit.src
  };

  localStorage.setItem("lunaris_pg", JSON.stringify(pg));
  msg.innerText = "Personaggio salvato ✨";
}

