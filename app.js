window.addEventListener('DOMContentLoaded', function () {

  // initial values for game variables.
  var initializeValues = function(bool) {
    boxValues = {};
    firstPlayerTurn = true;
    resetGame = false;
    playerOneScore = 0;
    playerTwoScore = 0;

    if (bool) {
      playAgain = true;
    } else {
      playAgain = false;
    }
  }

  initializeValues(false);


  ///////////////////////////////////////////////////////////
  // functions for event handlers

  var setupBoard = function() {

    if (resetGame || !playAgain) {
      rows = document.querySelector('.rows');
      cols = document.querySelector('.cols');
    }

    validateInput();
    createRows();
    addScoresReset();
  }

  var gameClick = function(event) {
    if (event.target.className.slice(0,3) == 'he-' || event.target.className.slice(0,3) == 've-') {
      changeEdgeColor(event.target, event);
      var scored = incrementScores(addEdgeClicks(event));
      checkTurnChange(scored);
      checkIfOver();
    }
  }

  var resetBoard = function() {
    initializeValues(false);
    destroyBoard();
    recreateInput();
    listenByClass('.gameboard-submit', 'click', setupBoard);
  }

  var playAgainReset = function() {
    initializeValues(true);
    destroyGameOver();
    resetScoreboard();
    setupBoard();
  }


  ///////////////////////////////////////////////////////////
  // Define helpers to add event listeners, then use to setup game.

  var listenByDiv = function(divName, eventName, func) {
    divName.addEventListener(eventName, func);
  }

  var listenByClass = function(className, eventName, func) {
    document.querySelector(className).addEventListener(eventName, func);
  }

  listenByClass('.gameboard-submit', 'click', setupBoard);


  ///////////////////////////////////////////////////////////
  // setupBoard functions

  var validateInput = function() {

    if (rows.value > 8) {
      rows.value = 8;
    } else if (rows.value < 1) {
      rows.value = 1;
    }

    if (cols.value > 8) {
      cols.value = 8;
    } else if (cols.value < 1) {
      cols.value = 1;
    }
  }

  var createRows = function() {

    var horizontalRowCreated = false;
    var verticalRowCreated = false;

    for (var j = 0; j <= rows.value; j++) {
      for (var i = 1; i <= cols.value; i++) {

        if (j > 0) {
          boxValues["" + j + i] = {};
          boxValues["" + j + i]['numberFilled'] = 0;
        }

        if (horizontalRowCreated != true) {
          var horizontalRowDiv = document.createElement('div');
          document.querySelector('.game-container').appendChild(horizontalRowDiv);
          horizontalRowDiv.className = 'horizontal-row-' + j;
          horizontalRowCreated = true;
        }

        var cornerDiv = document.createElement('div');
        document.querySelector('.horizontal-row-' + j).appendChild(cornerDiv);
        cornerDiv.className = 'corner';

        var horizontalEdgeDiv = document.createElement('div');
        document.querySelector('.horizontal-row-' + j).appendChild(horizontalEdgeDiv);
        horizontalEdgeDiv.className = 'he-' + (j + 1) + i + ' p1-turn';

        if (i == cols.value) {
          var cornerDiv = document.createElement('div');
          document.querySelector('.horizontal-row-' + j).appendChild(cornerDiv);
          cornerDiv.className = 'corner';
          horizontalRowCreated = false;
        }

        if (j < rows.value) {
          if (verticalRowCreated != true) {
            var verticalRowDiv = document.createElement('div');
            document.querySelector('.game-container').appendChild(verticalRowDiv);
            verticalRowDiv.className = 'vertical-row-' + j;
            verticalRowCreated = true;
          }

          var verticalEdgeDiv = document.createElement('div');
          document.querySelector('.vertical-row-' + j).appendChild(verticalEdgeDiv);
          verticalEdgeDiv.className = 've-' + (j + 1) + i + ' p1-turn';

          var boxDiv = document.createElement('div');
          document.querySelector('.vertical-row-' + j).appendChild(boxDiv);
          boxDiv.className = 'box-' + (j + 1) + i;

          if (i == cols.value) {
            var verticalEdgeDiv = document.createElement('div');
            document.querySelector('.vertical-row-' + j).appendChild(verticalEdgeDiv);
            verticalEdgeDiv.className = 've-' + (j + 1) + (i + 1) +  ' p1-turn';
            verticalRowCreated = false;
          }
        }
      }
    }

    var gameContainer = document.querySelector('.game-container')
    listenByDiv(gameContainer, 'click', gameClick);

  }

  var addScoresReset = function() {
    if (!playAgain) {
      var inputContainer = document.querySelector('.input-container');
      var gameSetup = document.querySelector('.game-setup');
      document.querySelector('.gameboard-submit').removeEventListener('click', setupBoard);
      inputContainer.removeChild(gameSetup);

      var resetBoardDiv = document.createElement('div');
      resetBoardDiv.className = 'gameboard-reset';
      document.querySelector('.input-container').appendChild(resetBoardDiv);

      var resetButton = document.createElement('button');
      resetButton.className = 'btn btn-secondary reset-board';
      resetButton.innerHTML = 'Setup Again';
      resetBoardDiv.appendChild(resetButton);

      listenByClass('.reset-board', 'click', resetBoard);

      var scoreBoard = document.createElement('div');
      document.body.appendChild(scoreBoard);
      scoreBoard.className = 'score-board';

      var playerOneScoreCreate = document.createElement('div');
      scoreBoard.appendChild(playerOneScoreCreate);
      playerOneScoreCreate.className = 'p1-score';
      playerOneScoreCreate.innerHTML = 'Player One Score: 0';

      var playerTwoScoreCreate = document.createElement('div');
      scoreBoard.appendChild(playerTwoScoreCreate);
      playerTwoScoreCreate.className = 'p2-score';
      playerTwoScoreCreate.innerHTML = 'Player Two Score: 0';
    }
  }


  ///////////////////////////////////////////////////////////
  // edgeClick functions

  var changeEdgeColor = function(target, event) {
    target.style.backgroundColor = '#000';
    target.className = event.target.className.substring(0,5);
  }

  var addEdgeClicks = function(event) {
    var edgeRow = parseInt(event.target.className.substring(3,4));
    var edgeCol = parseInt(event.target.className.substring(4,5));
    var boxIndex = [];
    if (event.target.className.indexOf('he') > -1) {
      if (edgeRow == 1) {
        boxIndex[0] = "" + edgeRow + edgeCol;
      } else if (edgeRow == (parseInt(rows.value) + 1)) {
        boxIndex[0] = "" + (edgeRow - 1) + edgeCol;
      } else {
        boxIndex[0] = "" + (edgeRow - 1) + edgeCol;
        boxIndex[1] = "" + edgeRow + edgeCol;
      }
    }

    if (event.target.className.indexOf('ve') > -1) {
      if (edgeCol == 1) {
        boxIndex[0] = "" + edgeRow + edgeCol;
      } else if (edgeCol == (parseInt(cols.value) + 1)) {
        boxIndex[0] = "" + edgeRow + (edgeCol - 1);
      } else {
        boxIndex[0] = "" + edgeRow + (edgeCol - 1);
        boxIndex[1] = "" + edgeRow + edgeCol;
      }
    }

    return boxIndex;
  }

  var incrementScores = function(box) {
    scored = false;
    for (var k = 0; k < box.length; k++) {
      boxValues[box[k]]['numberFilled']++;
      if (boxValues[box[k]]['numberFilled'] == 4) {
        if (firstPlayerTurn) {
          playerOneScore++;
          document.querySelector('.box-' + box[k]).className = 'box player-1';
          document.querySelector('.p1-score').innerHTML = 'Player One Score: ' + playerOneScore;
        } else {
          playerTwoScore++;
          document.querySelector('.box-' + box[k]).className = 'box player-2';
          document.querySelector('.p2-score').innerHTML = 'Player Two Score: ' + playerTwoScore;
        }
        var scored = true;
      }
    }
    return scored;
  }

  var checkTurnChange = function(scored) {
    if (!scored) {
      if (firstPlayerTurn) {
        var emptyNodes = document.querySelectorAll('.p1-turn');
        for (var i = 0; i < emptyNodes.length; i++) {
          emptyNodes[i].className = emptyNodes[i].className.substring(0,6) + 'p2-turn';
        }
      } else {
        var emptyNodes = document.querySelectorAll('.p2-turn');
        for (var i = 0; i < emptyNodes.length; i++) {
          emptyNodes[i].className = emptyNodes[i].className.substring(0,6) + 'p1-turn';
        }
      }
      firstPlayerTurn = !firstPlayerTurn;
    }
  }

  var checkIfOver = function() {
    if (playerOneScore + playerTwoScore == (rows.value * cols.value)) {

      var gameOverDiv = document.createElement('div');
      document.body.appendChild(gameOverDiv);
      gameOverDiv.className = 'game-over';

      if (playerOneScore > playerTwoScore) {
        gameOverDiv.innerHTML = '<p>Player one wins!</p>';
      } else if (playerOneScore < playerTwoScore) {
        gameOverDiv.innerHTML = '<p>Player two wins!</p>';
      } else {
        gameOverDiv.innerHTML = '<p>Game ends in a tie!</p>';
      }

      var playAgainDiv = document.createElement('div');
      var playAgainButton = document.createElement('button');
      document.querySelector('.game-over').appendChild(playAgainDiv);
      playAgainDiv.className = 'input-container';

      playAgainDiv.appendChild(playAgainButton);
      playAgainButton.className = 'btn btn-primary play-again';
      playAgainButton.innerHTML = 'Play Again!';

      listenByClass('.play-again', 'click', playAgainReset);
    }
  }


  ///////////////////////////////////////////////////////////
  // resetBoard functions

  var destroyBoard = function() {
    var gameContainer = document.querySelector('.game-container')
    while (gameContainer.hasChildNodes()) {
      gameContainer.removeChild(gameContainer.firstChild);
    }

    var gameReset = document.querySelector('.gameboard-reset');
    document.querySelector('.input-container').removeChild(gameReset);

    var scoreBoard = document.querySelector('.score-board');
    document.body.removeChild(scoreBoard);

    var gameOver = document.querySelector('.game-over')
    if (gameOver) {
      document.body.removeChild(gameOver);
    }
  }

  var recreateInput = function() {
    var gameSetupDiv = document.createElement('div');
    document.querySelector('.input-container').appendChild(gameSetupDiv);
    gameSetupDiv.className = 'game-setup';

    var gameboardInputRows = document.createElement('div');
    document.querySelector('.game-setup').appendChild(gameboardInputRows);
    gameboardInputRows.className = 'gameboard-input-rows';

    var rowsLabel = document.createElement('label');
    gameboardInputRows.appendChild(rowsLabel);
    rowsLabel.innerHTML = 'Rows:  ';
    rowsLabel.setAttribute('for', 'rows');

    var rowsInput = document.createElement('input');
    gameboardInputRows.appendChild(rowsInput);
    rowsInput.setAttribute('type', 'number');
    rowsInput.setAttribute('class', 'form-control rows');
    rowsInput.setAttribute('name', 'rows');
    rowsInput.setAttribute('min', '1');
    rowsInput.setAttribute('max', '8');
    rowsInput.setAttribute('placeholder', '1');

    var gameboardInputCols = document.createElement('div');
    document.querySelector('.game-setup').appendChild(gameboardInputCols);
    gameboardInputCols.className = 'gameboard-input-cols';

    var colsLabel = document.createElement('label');
    gameboardInputCols.appendChild(colsLabel);
    colsLabel.innerHTML = 'Columns:  ';
    colsLabel.setAttribute('for', 'cols');

    var colsInput = document.createElement('input');
    gameboardInputCols.appendChild(colsInput);
    colsInput.setAttribute('type', 'number');
    colsInput.setAttribute('class', 'form-control cols');
    colsInput.setAttribute('name', 'cols');
    colsInput.setAttribute('min', '1');
    colsInput.setAttribute('max', '8');
    colsInput.setAttribute('placeholder', '1');


    var gameboardSubmit = document.createElement('div');
    document.querySelector('.game-setup').appendChild(gameboardSubmit);
    gameboardSubmit.className = 'gameboard-submit';

    var playButton = document.createElement('button');
    gameboardSubmit.appendChild(playButton);
    playButton.className = 'btn btn-primary';
    playButton.setAttribute('type', 'submit');
    playButton.innerHTML = 'Play!'
  }


  ///////////////////////////////////////////////////////////
  // play again reset functions

  var destroyGameOver = function() {
    var gameContainer = document.querySelector('.game-container')
    while (gameContainer.hasChildNodes()) {
      gameContainer.removeChild(gameContainer.firstChild);
    }

    var gameOver = document.querySelector('.game-over')
    document.body.removeChild(gameOver);
  }

  var resetScoreboard = function() {
    document.querySelector('.p1-score').innerHTML = 'Player One Score: 0';
    document.querySelector('.p2-score').innerHTML = 'Player Two Score: 0';;
  }


});
