var socket = io.connect('http://' + document.domain + ':8080');
var selected = [];
var submitted = false;
var difference = 0;
var started = false;
var judge = false;
var username = decodeURIComponent(window.location.pathname.split("/")[2])

socket.on('starting', function (chooser) {
  if (chooser == username) {
    window.alert('you are judging');
    judge = true;
    document.getElementById("choosecard").style.display = "none";
  } else {
    judge = false;
  }
  document.getElementById("judge").innerHTML = "current judge: " + chooser;
  started = true;
  socket.emit('get hand', { data: username });
  choosecard = document.getElementById("choosecard");
  choosecard.style.backgroundColor = "";
  choosecard.style.width = "";
  choosecard.innerHTML = "<p>select</p>";
  submitted = false;
  selected = [];
});

socket.on('update hand', function (msg) {
  if (judge) {
    var myNode = document.getElementById("holder");
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
    return;
  }
  var cards = msg.split("|");
  cards.splice(0, 1);

  var myNode = document.getElementById("holder");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }

  for (var i = 0; i < cards.length; i++) {
    var cardbox = document.createElement("div");
    cardbox.className = "cardbox";
    cardbox.id = parseInt(cards[i].substr(0, 4));
    cardbox.addEventListener("click", function () {
      selectCard(this)
    });
    cardbox.appendChild(document.createTextNode(cards[i].substr(4)));
    document.getElementById("holder").appendChild(cardbox);
  }

  document.getElementById("choosecard").style.display = "block";
});

socket.on('players list', function (data) {
  var players = data;
  console.log(data);

  var leaderboard = document.getElementById("leaderboard");
  while (leaderboard.firstChild) {
    leaderboard.removeChild(leaderboard.firstChild);
  }

  for (var player in players) {
    var score = document.createElement("div");
    score.className = "score";
    var para = document.createElement("p");
    para.appendChild(document.createTextNode(player + ": " + players[player]));
    score.appendChild(para);
    leaderboard.appendChild(score);
  }
});

socket.on('update prompt', function (msg) {
  difference = parseInt(msg.substr(0, 1));
  document.getElementById("prompt").innerHTML = msg.substr(1);
});

socket.on('all in', function () {
  var myNode = document.getElementById("holder");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
  socket.emit('get sub');
  choosecard = document.getElementById("choosecard");
  if (judge) {
    choosecard.style.backgroundColor = "";
    choosecard.style.width = "";
    choosecard.innerHTML = "<p>select</p>";
    choosecard.style.display = "block";
  } else {
    choosecard.style.display = "none";
  }
});

socket.on('recv sub', function (msg) {
  var cards = msg.split("|");

  var subbox = document.createElement("div");
  subbox.className = "subbox";
  subbox.id = cards[0];
  subbox.addEventListener("click", function () {
    selectSub(this)
  });
  for (var i = 1; i < cards.length; i++) {
    var para = document.createElement("p");
    para.appendChild(document.createTextNode(cards[i]));
    subbox.appendChild(para);
  }
  document.getElementById("holder").appendChild(subbox);
});

socket.on('winner', function (user) {
  window.alert("winner: " + user);
});

socket.on('ping out', function () {
  console.log("ping recieved");
});

function selectCard(elmnt) {
  if (submitted) {
    return;
  }

  elemLoc = selected.indexOf(elmnt.id);
  if (elemLoc >= 0) {
    elmnt.style.backgroundColor = "";
    selected.splice(elemLoc, 1);
  } else {
    if (selected.length < difference) {
      elmnt.style.backgroundColor = "#d9cbe2";
      selected.push(elmnt.id);
    }
  }
}

function selectSub(elmnt) {
  if (submitted) {
    return;
  }

  elemLoc = selected.indexOf(elmnt.id);
  if (elemLoc >= 0) {
    var children = elmnt.children;
    for (var i = 0; i < children.length; i++) {
      var tableChild = children[i];
      tableChild.style.backgroundColor = "";
    }
    selected.splice(elemLoc, 1);
  } else {
    if (selected.length < 1) {
      var children = elmnt.children;
      for (var i = 0; i < children.length; i++) {
        var tableChild = children[i];
        tableChild.style.backgroundColor = "#d9cbe2";
      }
      selected.push(elmnt.id);
    }
  }
}

function submitCards(elmnt) {
  if (submitted) {
    return;
  }

  if (judge) {
    if (selected.length == 1) {
      submitted = true;
      socket.emit('winner', { 'data': selected[0] });
      elmnt.style.backgroundColor = "#c2d3c0";
      elmnt.style.width = "8em";
      elmnt.innerHTML = "<p>submitted</p>";
    } else {
      window.alert("please select more cards");
    }
    return;
  }

  if (selected.length == difference) {
    submitted = true;
    socket.emit('submit cards', {
      'data': [username, selected]
    });
    elmnt.style.backgroundColor = "#c2d3c0";
    elmnt.style.width = "8em";
    elmnt.innerHTML = "<p>submitted</p>";
  } else {
    window.alert("please select more cards");
  }
}