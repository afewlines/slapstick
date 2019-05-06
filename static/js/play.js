var socket = io.connect('http://' + document.domain + ':8080');
var selected = [];
var submitted = false;
var difference = 1;
var started = false;
var judge = false;
var username = decodeURIComponent(window.location.pathname.split("/")[2])


socket.on('connect', function () {
  socket.emit('players get');
  socket.emit('request update');
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

socket.on('update question', function (data) {
  document.getElementById("question").innerHTML = data[0];
  document.getElementById("questionnumber").innerHTML = "" + data[1] + " of " + data[2];
});

socket.on('update answers', function (answers) {
  console.log(answers);
  started = true;

  var holder = document.getElementById("holder");
  var subbutton = document.getElementById("choosecard");

  if (subbutton.classList.contains("submitted")) {
    subbutton.classList.remove("submitted");
    subbutton.innerHTML = "<p>Submit</p>";
  } else {
    subbutton.innerHTML = "<p>Submit</p>";
  }
  selected = [];
  submitted = false;

  while (holder.firstChild) {
    holder.removeChild(holder.firstChild);
  }

  for (var answer in answers) {
    var answerbox = document.createElement("div");
    answerbox.className = "answerbox";
    answerbox.appendChild(document.createTextNode(answers[answer]));
    answerbox.addEventListener("click", function () {
      selectCard(this);
    });
    document.getElementById("holder").appendChild(answerbox);
  }

  document.getElementById("choosecard").style.display = "block";
});

socket.on('result', function (payload) {
  if (payload[1][username]) {
    window.alert("You got it right!");
  } else {
    window.alert("Sorry, ur wrong nerd.\nThe correct answer was: " + payload[0]);
  }
});

socket.on('ping out', function () {
  console.log("ping recieved");
});

socket.on('end', function (winner) {
  window.alert("Game Over~\nWinner: " + winner);
  window.location = "/";
});

function selectCard(elmnt) {
  if (submitted) {
    return;
  }

  elemLoc = selected.indexOf(elmnt.innerHTML);
  if (elemLoc >= 0) {
    elmnt.classList.remove("selected");
    selected.splice(elemLoc, 1);
  } else {
    if (selected.length < difference) {
      elmnt.classList.add("selected");
      selected.push(elmnt.innerHTML);
    }
  }
}

function selectSub(elmnt) {
  if (submitted || (!started)) {
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
  if (submitted || (!started)) {
    return;
  }

  if (selected.length == difference) {
    submitted = true;
    // force it to grab first because it's just trivia
    socket.emit('submit', [username, selected[0]]);
    elmnt.classList.add("submitted");
    elmnt.innerHTML = "<p>Submitted</p>";
  } else {
    window.alert("Please select more cards.");
  }
}