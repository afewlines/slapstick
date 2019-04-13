var socket = io.connect('http://' + document.domain + ':8080');

function submitUsername() {
  var lettersLower = "abcdefghijklmnopqrstuvwxyz";
  var lettersUpper = lettersLower.toUpperCase();
  var numerals = "0123456789";
  var punctuation = " .,!?'#$%&()*+-/:=@^_|~";
  var complete = lettersLower + lettersUpper + numerals + punctuation
  // put into array for
  var username = document.getElementById("username").value;
  var nameArray = username.split("");
  var offenders = [];

  for (var i = 0; i < nameArray.length; i++) {
    if (!complete.includes(nameArray[i])) {
      if (!offenders.includes(nameArray[i])) {
        offenders.push(nameArray[i]);
      }
    }
  }

  if (offenders.length > 0) {
    window.alert("username contains ILLEGAL characters!!\nhere they are: " + offenders.join(""));
    document.getElementById("username").value = "";
    return;
  }

  console.log("username \"" + username + "\" checks out!");
  socket.emit('user connect', username);
}

function processForm(e) {
  if (e.preventDefault) e.preventDefault();

  submitUsername();

  // You must return false to prevent the default form behavior
  return false;
}

var form = document.getElementById("usernameForm");
if (form.attachEvent) {
  form.attachEvent("submit", processForm);
} else {
  form.addEventListener("submit", processForm);
}



socket.on('question', function (text) {
  console.log("Question is: " + text);
});

socket.on('play', function (payload) {
  console.log(payload);
  if (payload[0]) {
    window.location = ("/play/" + payload[1]);
  } else {
    window.alert("invalid username!");
  }
});