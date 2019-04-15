var socket = io.connect('http://' + document.domain + ':8080');
var selected = [];
var submitted = false;
var difference = 1;
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

socket.on('update question', function (question) {
  document.getElementById("question").innerHTML = question;
});

socket.on('update answers', function (answers) {
  console.log(answers);

  var holder = document.getElementById("holder");
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
    window.alert("you got it right!");
  } else {
    window.alert("sorry, ur wrong nerd. correct answer was: " + payload[0]);
  }
});

socket.on('ping out', function () {
  console.log("ping recieved");
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

  if (selected.length == difference) {
    submitted = true;
    // force it to grab first because it's just trivia
    socket.emit('submit', [username, selected[0]]);
    elmnt.classList.add("submitted");
    //elmnt.style.backgroundColor = "#c2d3c0";
    //elmnt.style.width = "8em";
    //elmnt.innerHTML = "<p>submitted</p>";
  } else {
    window.alert("please select more cards");
  }
}