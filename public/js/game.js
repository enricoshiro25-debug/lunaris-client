const socket = io();

// invio posizione
function sendMove(x,y) {
  socket.emit("move",{x,y});
}

// ricezione aggiornamento
socket.on("updatePosition", data=>{
  // per ora log
  console.log("Player si muove a:", data);
});

// chat
function sendChat(msg){
  socket.emit("chat", msg);
}
socket.on("chatMessage", msg=>{
  console.log("Chat:", msg);
});

