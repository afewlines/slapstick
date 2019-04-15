var socket = io.connect('http://' + document.domain + ':8080');
var lastElement;

function updatePlayers() {
  socket.emit('players get');
}

function sendPing() {
  socket.emit('ping');
}

function startGame() {
  socket.emit('start game');
}

function forceCheck() {
  socket.emit('force check');
}


socket.on('players list', function (payload) {
  console.log("recieved");
  var targetRoot = document.getElementById("players").children[0];
  while (targetRoot.firstChild) {
    targetRoot.removeChild(targetRoot.firstChild);
  }

  for (var user in payload) {
    targetRoot.appendChild(createRow(user, payload[user]));
  }
});

function createRow(username, points) {
  var row_root = document.createElement("tr");

  var user = document.createElement("td");
  user.innerHTML = username;
  row_root.appendChild(user);

  var pts = document.createElement("td");
  pts.innerHTML = points;
  row_root.appendChild(pts);

  var dropdown = document.createElement("td");
  dropdown.innerHTML = "actions";
  dropdown.classList.add("dropdown");
  dropdown.addEventListener("click", function () {
    var tgt = dropdown;
    toggleDropdown(tgt);
  });
  row_root.appendChild(dropdown);

  var payload = document.createElement("ul");
  payload.style.display = "none";
  dropdown.appendChild(payload);

  var remove = document.createElement("li");
  remove.innerHTML = "remove";
  remove.addEventListener("click", function () {
    var tgt = remove;
    fireOption(tgt);
  });
  payload.appendChild(remove);

  var reset = document.createElement("li");
  reset.innerHTML = "reset score";
  reset.addEventListener("click", function () {
    var tgt = reset;
    fireOption(tgt);
  });
  payload.appendChild(reset);

  var goof = document.createElement("li");
  goof.innerHTML = "goof";
  goof.addEventListener("click", function () {
    var tgt = goof;
    fireOption(tgt);
  });
  payload.appendChild(goof);


  return row_root;
}

function toggleDropdown(drop) {
  target = drop.children[0];
  if (target.classList.contains("show")) {
    setTimeout(function () { target.style.display = "none"; }, 125);
    target.classList.remove("show");
  } else {
    target.style.display = "block";
    target.classList.add("show");
  }
}

function fireOption(option) {
  var target = option.parentElement.parentElement.parentElement.children[0].innerHTML;
  console.log(option.innerHTML + ": " + target);
}

function debugg(name, pt) {
  var test = createRow(name, pt);
  var rt = document.getElementById("players").children[0];
  rt.appendChild(test);
}