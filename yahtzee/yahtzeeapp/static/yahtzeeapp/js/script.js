
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

function drawBoard() {

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

  fetch('http://127.0.0.1:8000/api/v1/board/')  
    .then(status)  
    .then(json)  
    .then(function(data) {  

      console.log(data[0]['players']['players']);
      console.log(data[0]['board']['1']);
      console.log(data[0]['players']['players'].length);
      mainBoard = data[0];

      var board = document.querySelector('.board');
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

drawBoard();

button = document.querySelector('.testBut');
button.onclick = function() {
  console.log(mainBoard)
}















