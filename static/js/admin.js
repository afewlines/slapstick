var socket = io.connect('http://' + document.domain + ':8080');

function updatePlayers() {
  window.alert("UPDATE");
}

function sendPing() {
  socket.emit('ping');
}