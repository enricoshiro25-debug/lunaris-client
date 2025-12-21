let faceIndex = 0;
let robeIndex = 0;

const faces = [
  { file: "face1.png", bottom: 60 },
  { file: "face2.png", bottom: 56 },
  { file: "face3.png", bottom: 62 }
];

const robes = ["robe1.png", "robe2.png", "robe3.png"];

function updateAvatar() {
  const face = document.getElementById("face");
  const robe = document.getElementById("robe");

  face.src = "/images/avatars/face/" + faces[faceIndex].file;
  face.style.bottom = faces[faceIndex].bottom + "px";

  robe.src = "/images/avatars/robe/" + robes[robeIndex];
}

function nextFace() {
  faceIndex = (faceIndex + 1) % faces.length;
  updateAvatar();
}

function prevFace() {
  faceIndex = (faceIndex - 1 + faces.length) % faces.length;
  updateAvatar();
}

function nextRobe() {
  robeIndex = (robeIndex + 1) % robes.length;
  updateAvatar();
}

function prevRobe() {
  robeIndex = (robeIndex - 1 + robes.length) % robes.length;
  updateAvatar();
}

// inizializza
updateAvatar();
