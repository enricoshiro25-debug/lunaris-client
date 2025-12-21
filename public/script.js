let faceIndex = 0;
let robeIndex = 0;

const faces = ["face1.png", "face2.png", "face3.png"];
const robes = ["robe1.png", "robe2.png", "robe3.png"];

function updateAvatar() {
  document.getElementById("face").src =
    "/images/avatars/face/" + faces[faceIndex];

  document.getElementById("robe").src =
    "/images/avatars/robe/" + robes[robeIndex];
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
