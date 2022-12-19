
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

var mainBoard;
var board = document.querySelector('.board');
var info = document.querySelector('.info');
var startNewGameButton = document.querySelector('.newGame');
var addGamerButton = document.querySelector('.addGamer');
var delGamerButton = document.querySelector('.delGamer');
var sendNewGameRequestButton = document.querySelector('.sendNewGameRequest');


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


function drawBoard() {

  fetch('http://127.0.0.1:8000/api/v1/board/')  
    .then(status)  
    .then(json)  
    .then(function(data) {  

      console.log(data[0]['players']['players']);
      console.log(data[0]['board']['1']);
      console.log(data[0]['players']['players'].length);
      mainBoard = data[0];

      var table = document.createElement('table');
      board.appendChild(table);
      
      // створення заголовка з іменами
      var thTr = document.createElement('tr');
      for (name of [''].concat(data[0]['players']['players'])) {
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
        tdTr.appendChild(td);

        for (num of data[0]['board'][combination]) {
          var td = document.createElement('td');
          td.textContent = num;
          tdTr.appendChild(td);        
        };

        table.appendChild(tdTr);      
      };


    }).catch(function(error) {  
      console.log('Request failed', error);
    });
}

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
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        "X-CSRFToken": csrftoken },
    body: JSON.stringify(data)
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}


function startNewGame(gamers) {
  postData('http://127.0.0.1:8000/api/v1/board/', {"players": gamers})
  .then((data) => {
    console.log(data);
  });
};


function onLoadPage() {
  var test = fetch('http://127.0.0.1:8000/api/v1/board/')  
    .then(status)  
    .then(json)  
    .then(function(data) {
      if (!data.length) {
        info.textContent = 'Розпочніть нову гру!';
      } else {
        drawBoard();
      }
    })
    .catch((error) => {
      info.textContent = 'Вам потрібно пройти авторизацію!';
    });
};


function clearBoard() {
  board.textContent = '';
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
    console.log(data);
    
    clearBoard()
    drawBoard()
  });
};


addGamerButton.addEventListener('click', addGamerInputButtom);
delGamerButton.addEventListener('click', delGamerInputButtom);
sendNewGameRequestButton.addEventListener('click', sendNewGameRequest);

onLoadPage();




















