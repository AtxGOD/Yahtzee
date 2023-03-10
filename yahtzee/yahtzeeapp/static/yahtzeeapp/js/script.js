
const combinations = ['1', 
                      '2', 
                      '3', 
                      '4', 
                      '5', 
                      '6', 
                      'Школа', 
                      'Пара', 
                      '2 пари', 
                      'Сет', 
                      'М. стріт', 
                      'В. стріт', 
                      'Пар', 
                      'Нечет', 
                      'Фул хаус', 
                      'Каре', 
                      'Сміття', 
                      'Яцзи', 
                      'Сума'];


let combinationsButtons = {
    '1': ['0', '1', '2', '3', '4', '5'], 
    '2': ['0', '2', '4', '6', '8', '10'], 
    '3': ['0', '3', '6', '9', '12', '15'], 
    '4': ['0', '4', '8', '12', '16', '20'], 
    '5': ['0', '5', '10', '15', '20', '25'], 
    '6': ['0', '6', '12', '18', '24', '30'], 
    'Пара': ['0', '2', '4', '6', '8', '10', '12'], 
    '2 пари': ['0', '6', '8', '10', '12', '14', '16', '18', '20', '22'], 
    'Сет': ['0', '3', '6', '9', '12', '15', '18'], 
    'М. стріт': ['0', '10', '14', '18'], 
    'В. стріт': ['0', '15', '20'], 
    'Пар': ['0', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30'], 
    'Нечет': ['0', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23', '25'], 
    'Фул хаус': ['0', '7', '8', '9', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '26', '27', '28'], 
    'Каре': ['0', '4', '8', '12', '16', '20', '24'], 
    'Сміття': ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'], 
    'Яцзи': ['0', '50']
  };


var mainBoard;
var move;
var idPlayer;
var board = document.querySelector('.board');
var info = document.querySelector('.info');
var startNewGameButton = document.querySelector('.newGame');
var addGamerButton = document.querySelector('.addGamer');
var delGamerButton = document.querySelector('.delGamer');
var moveBackDiv = document.querySelector('.moveBack');
var sendNewGameRequestButton = document.querySelector('.sendNewGameRequest');
var logInInfoButton = document.querySelector('.logInInfo');
var registerInfoButton = document.querySelector('.registerInfo');


function status(response) {  
    if (response.status >= 200 && response.status < 300) {  
      return Promise.resolve(response)  
    } else { 
      return Promise.reject(new Error(response.statusText))  
    }  
  }


function json(response) {  
    return response.json()  
  }


function getBoard() {
  let auth = getCookie('Authorization');

  fetch('http://127.0.0.1:8000/api/v1/board/', {
    method: 'GET',
    headers: { 'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        "Authorization": auth},
  })  
    .then(status)  
    .then(json)  
    .then(function(data) {  
      drawBoard(data[0]);

    }).catch(function(error) {  
      console.log('Request failed', error);
    });
}


function drawBoard(data) {
      document.querySelector('.buttons').innerHTML = '';
      info.innerHTML = '';

      mainBoard = data;

      board.innerHTML = '';
      var table = document.createElement('table');
      board.appendChild(table);
      
      // створення заголовка з іменами
      var thTr = document.createElement('tr');
      for (name of [''].concat(data['players']['players'])) {
        var th = document.createElement('th');
        th.textContent = name;
        thTr.appendChild(th);
      };
      table.appendChild(thTr);

      // створення рядків з комбінаціями
      for (combination of combinations) {
        var tdTr = document.createElement('tr');
        var td = document.createElement('td');
        td.textContent = combination;

        if (combination == 'Школа' || combination == 'Сума') {
          td.style.backgroundColor = '#aaaaaa';
        };

        tdTr.appendChild(td);

        for (num of data['board'][combination]) {
          var td = document.createElement('td');
          td.textContent = num;
          tdTr.appendChild(td);        
        };

        table.appendChild(tdTr);      
      };

      move = playerMove();
      colorMovePlayer();

      addEventOnCells();

      moveBackDiv.innerHTML = '';
      if (mainBoard['moves']['moves'].length > 0) {        
        var moveBackButton = document.createElement('button');
        moveBackButton.innerHTML = 'Хід назад';
        moveBackDiv.appendChild(moveBackButton);
        moveBackButton.addEventListener('click', moveBack);
      };
};


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


async function postData(url = '', data = {}) {
  let csrftoken = getCookie('csrftoken');
  let auth = getCookie('Authorization');
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        "X-CSRFToken": csrftoken,
        "Authorization": auth},
    body: JSON.stringify(data)
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}


async function patchData(url = '', data = {}) {
  let csrftoken = getCookie('csrftoken');
  let auth = getCookie('Authorization');
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        "X-CSRFToken": csrftoken,
        "Authorization": auth},
    body: JSON.stringify(data)
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}


function onLoadPage() {
  clearBoard()

  let auth = getCookie('Authorization');

  var test = fetch('http://127.0.0.1:8000/api/v1/board/', {
      method: 'GET',
      headers: { 'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        "Authorization": auth}})  
    .then(status)  
    .then(json)  
    .then(function(data) {

      loginButton.innerHTML = 'Log out';
      loginButton.removeEventListener('click', showLoginFunc);
      registerButton.removeEventListener('click', showRegisterFunc);
      registerButton.hidden = true;
      loginButton.addEventListener('click', logOutFunc);

      if (!data.length) {
        info.textContent = 'Розпочніть нову гру!';
      } else {
        getBoard();
      }
    })
    .catch((error) => {
      info.textContent = 'Вам потрібно пройти авторизацію!';
      loginButton.innerHTML = 'Log in';
      loginButton.removeEventListener('click', logOutFunc);
      registerButton.hidden = false;
      registerButton.addEventListener('click', showRegisterFunc);
      loginButton.addEventListener('click', showLoginFunc);
    });
};


function clearBoard() {
  board.textContent = '';
  var divButtons = document.querySelector('.buttons');
  divButtons.innerHTML = '';
  moveBackDiv.innerHTML = '';
  info.innerHTML = '';
  logInInfoButton.innerHTML = '';
  registerInfoButton.innerHTML = '';
};


function addGamerInputButtom() {
  var newInput = document.createElement('input');
  var inputGamers = document.querySelector('.inputGamers');
  inputGamers.appendChild(newInput);
};


function delGamerInputButtom() {
  var inputGamers = document.querySelector('.inputGamers');
  inputGamers.lastChild.remove();
};


function sendNewGameRequest() {
  var inputGamers = document.querySelector('.inputGamers');
  var gamers = [];
  for (const child of inputGamers.children) {
    gamers.push(child.value);
  }

  postData('http://127.0.0.1:8000/api/v1/board/', {"players": gamers})
  .then((data) => {
    
    clearBoard()
    pc1.classList.toggle('hide');
    getBoard()

  });
};


function sendSaveGameHistoryRequest(name, maxNum) {
  let csrftoken = getCookie('csrftoken');
  let auth = getCookie('Authorization');

  var data = {
    'game_id': mainBoard['id'],
    'players': mainBoard['players']['players'],
    'board': mainBoard['board'],
    'win_player': name,
    'win_score': maxNum
  }

  var fetchRequest = {
    method: 'POST',
    headers: { 'Accept': 'application/json, text/plain, */*',
               'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
                'Authorization': auth},
    body: JSON.stringify(data)
  }

  fetch('http://127.0.0.1:8000/api/v1/save-game-history/', fetchRequest)
  .then((response) => response.json())
  .then((info) => {
    console.log(info);
  })
};


function findWinPlayer() {
  var arr = mainBoard['board']['Сума'].map(Number);
  var maxNum = Math.max.apply(null, arr);
  var name = mainBoard['players']['players'][mainBoard['board']['Сума'].indexOf(maxNum.toString())];

  sendSaveGameHistoryRequest(name, maxNum)
  return name;
};


function playerMove() {
  var trash;

  for (var i = 0; i < mainBoard['players']['players'].length; i++) {
    var count = 0;

    for (comb in mainBoard['board']) {
      if (mainBoard['board'][comb][i] != '') 
          {count += 1};
    }
    if (count == 0 || count < trash) 
      {return mainBoard['players']['players'][i]};
    trash = count;

  };
  if (trash == 19) {
    var win = findWinPlayer();
    info.textContent = `Кінець гри! Переміг ${win}`;
    return win;
  };

  return mainBoard['players']['players'][0];
};


function colorMovePlayer() {
  var headerTable = document.querySelectorAll('.board table tr th');
    for (const header of headerTable) {
      if (header.innerHTML == move)
        {header.classList.add('move-player');}
      else {header.classList.remove('move-player');};
      } 
};


function addEventOnCells() {
  var tds = document.querySelectorAll('.board table tr td');

  for (const th of document.querySelectorAll('.board table tr th')) {
    if (th.textContent.includes(move)) {
      idPlayer = Array.prototype.indexOf.call(th.parentElement.children, th);
      break;
    }
  }

  for (td of tds) {
    if (td.innerHTML == '' 
      & Array.prototype.indexOf.call(td.parentElement.children, td) == idPlayer 
      & td.parentElement.firstChild.innerHTML != 'Школа'
      & td.parentElement.firstChild.innerHTML != 'Сума') {
      td.classList.add('moveCell');
      td.onclick = activeDeactive;
      td.parentElement.firstChild.style.fontWeight = 'bold';
      td.parentElement.firstChild.style.backgroundColor = '#40E0D0';
    } else {
      td.classList.remove('moveCell');
    };
    if (td.innerHTML != '' 
      & Array.prototype.indexOf.call(td.parentElement.children, td) == idPlayer 
      & td.parentElement.firstChild.innerHTML != 'Школа'
      & td.parentElement.firstChild.innerHTML != 'Сума') {
      td.parentElement.firstChild.style.textDecoration = 'line-through';

    };
  };
};


function activeDeactive(element) {
  var remove = document.querySelectorAll('.moveCell');

  for (el of remove) {
    el.classList.remove('active');
  };

  element.target.classList.add('active');

  var divButtons = document.querySelector('.buttons');
  divButtons.innerHTML = '';

  for (number of combinationsButtons[element.target.parentElement.firstChild.innerHTML]) {
    var button = document.createElement('button');
    button.innerHTML = number;
    button.onclick = buttonClick;
    divButtons.appendChild(button);
  };
};


function buttonClick(element) {
  var newBoard = mainBoard['board'];
  var newMoves = mainBoard['moves'];

  com = document.querySelector('.active');

  mainBoard['moves']['moves'].push([move, com.parentElement.firstChild.innerHTML])
  newBoard[com.parentElement.firstChild.innerHTML][idPlayer - 1] = element.target.innerHTML;

  patchData(`http://127.0.0.1:8000/api/v1/board/${mainBoard['id']}/`, 
              {"board": newBoard, "moves": newMoves})
  .then((data) => {

    drawBoard(data);

  });
};


function moveBack() {
  var index = mainBoard['players']['players'].indexOf(mainBoard['moves']['moves'].slice(-1)[0][0]);
  var newBoard = mainBoard['board'];
  var newMoves = mainBoard['moves'];

  newBoard[mainBoard['moves']['moves'].slice(-1)[0][1]][index] = '';
  newMoves['moves'].pop();

  patchData(`http://127.0.0.1:8000/api/v1/board/${mainBoard['id']}/`, 
              {"board": newBoard, "moves": newMoves})
  .then((data) => {

    drawBoard(data);

  });
};


function showLoginFunc() {
  var li = document.querySelector('.logInInputData');

  li.classList.toggle('hide');
};


function loginFunc(e) {
  let csrftoken = getCookie('csrftoken');
  let auth = getCookie('Authorization');

  var data = {
    'username': e.target.parentElement.querySelector('.username').value,
    'password': e.target.parentElement.querySelector('.password').value,
  }

  var fetchRequest = {
    method: 'POST',
    headers: { 'Accept': 'application/json, text/plain, */*',
               'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,},
    body: JSON.stringify(data)
  }

  fetch('http://127.0.0.1:8000/api/v1/drf-auth/', fetchRequest)
  .then((response) => response.json())
  .then((data) => {
    if (Object.keys(data).includes("non_field_errors")) {
      logInInfoButton.innerHTML = data['non_field_errors'];
    };
    if (Object.keys(data).includes("token")) {
      document.cookie = "Authorization" + "=" + "Token " + data['token'];
      showLoginFunc();
      onLoadPage();
    };
  })
};


function logOutFunc() {
  let auth = getCookie('Authorization');

  var fetchRequest = {
    method: 'GET',
    headers: { 'Accept': 'application/json, text/plain, */*',
               'Content-Type': 'application/json',
                "Authorization": auth},
  }

  fetch('http://127.0.0.1:8000/api/v1/drf-auth/logout', fetchRequest)
  .then((response) => response.json())
  .then((data) => {
    onLoadPage()
  })
};


function showRegisterFunc() {
  var rf = document.querySelector('.registerInputData');

  rf.classList.toggle('hide');
};


function registerNewUsername(e) {
  let csrftoken = getCookie('csrftoken');

  var data = {
    'username': e.target.parentElement.querySelector('.username').value,
    'email': e.target.parentElement.querySelector('.email').value,
    'password': e.target.parentElement.querySelector('.password').value,
  }

  var fetchRequest = {
    method: 'POST',
    headers: { 'Accept': 'application/json, text/plain, */*',
               'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,},
    body: JSON.stringify(data)
  }

  fetch('http://127.0.0.1:8000/api/v1/drf-auth/register', fetchRequest)
  .then((response) => response.json())
  .then((data) => {
    if (Object.keys(data).includes("username")) {
      registerInfoButton.innerHTML = data['username'];
    } else if (Object.keys(data).includes("user")) {
    registerInfoButton.innerHTML = 'Аккаунт створений';
  }
  });
};


var registerButton = document.querySelector('.registerButton');
var sendRegisterRequestButtom = document.querySelector('.sendRegisterRequest');
sendRegisterRequestButtom.addEventListener('click', registerNewUsername);

var loginButton = document.querySelector('.loginButton');
var sendLogInRequestButtom = document.querySelector('.sendLogInRequest');
sendLogInRequestButtom.addEventListener('click', loginFunc);

var btn = document.querySelectorAll('.newGame');
var pc1 = document.querySelector('.newGameInputNewGamers');

btn.forEach(item => {item.addEventListener('click', function() {
  pc1.classList.toggle('hide');
});})

addGamerButton.addEventListener('click', addGamerInputButtom);
delGamerButton.addEventListener('click', delGamerInputButtom);
sendNewGameRequestButton.addEventListener('click', sendNewGameRequest);

var historyButton = document.querySelector('.historyButton');
// historyButton.location.href = 'http://127.0.0.1:8000/history/';

historyButton.addEventListener('click', () => {
  window.location.href = 'http://127.0.0.1:8000/history/';
});



onLoadPage();
















