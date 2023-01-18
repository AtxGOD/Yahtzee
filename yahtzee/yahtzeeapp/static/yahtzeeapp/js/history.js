
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


var board = document.querySelector('.board');
var top = document.querySelector('.top');


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


function onLoadPage() {

  let auth = getCookie('Authorization');

  var test = fetch('http://127.0.0.1:8000/api/v1/board-history/', {
      method: 'GET',
      headers: { 'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        "Authorization": auth}})  
    .then((response) => response.json())  
    .then(function(data) {
      console.log(data);
      drawBoard(data['board']);
      showTop(data['top'])
    })
  };


function drawBoard(data) {

      board.innerHTML = '';
      var table = document.createElement('table');
      board.appendChild(table);
      
      // створення заголовка з іменами
      var thTr = document.createElement('tr');
      for (name of [''].concat(data['players'])) {
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
};


function showTop(data) {
  var table = document.querySelector('.top table');

  for (row of data) {
    var tr = document.createElement('tr');

    var gamer = document.createElement('td');
    gamer.textContent = row['win_player'];
    var score = document.createElement('td');
    score.textContent = row['win_score'];

    tr.appendChild(gamer);
    tr.appendChild(score);
    table.appendChild(tr);

  };
};


onLoadPage();




















