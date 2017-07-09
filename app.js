window.addEventListener('DOMContentLoaded', function () {

  var horizontalRowCreated = false;
  var verticalRowCreated = false;
  var boxValues = {};
  var firstPlayerTurn = true;
  var scored;
  var playAgain = false;
  var resetGame = false;

  playerOneScore = 0;
  playerTwoScore = 0;

  var setupBoard = function() {
    if (resetGame || !playAgain) {
      rows = document.querySelector('.rows');
      cols = document.querySelector('.cols');
    }

    if (rows.value > 8) {
      rows.value = 8;
    }

    if (rows.value < 1) {
      rows.value = 1;
    }

    if (cols.value > 8) {
      cols.value = 8;
    }

    if (cols.value < 1) {
      cols.value = 1;
    }

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

        horizontalEdgeDiv.addEventListener('click', edgeClick);


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
          verticalEdgeDiv.addEventListener('click', edgeClick);

          var boxDiv = document.createElement('div');
          document.querySelector('.vertical-row-' + j).appendChild(boxDiv);
          boxDiv.className = 'box-' + (j + 1) + i;

          if (i == cols.value) {
            var verticalEdgeDiv = document.createElement('div');
            document.querySelector('.vertical-row-' + j).appendChild(verticalEdgeDiv);
            verticalEdgeDiv.className = 've-' + (j + 1) + (i + 1) +  ' p1-turn';
            verticalEdgeDiv.addEventListener('click', edgeClick);
            verticalRowCreated = false;
          }
        }
      }
    }

    var gameSetup = document.querySelector('.game-setup');
    if (!playAgain) {
      this.removeEventListener('click', setupBoard);
      gameSetup.remove();

      var resetBoardDiv = document.createElement('div');
      var resetButton = document.createElement('button');
      document.querySelector('.input-container').appendChild(resetBoardDiv);
      resetBoardDiv.className = 'gameboard-reset';

      resetBoardDiv.appendChild(resetButton);
      resetButton.className = 'btn btn-secondary reset-board';
      resetButton.innerHTML = 'Setup Again';
      document.querySelector('.reset-board').addEventListener('click', resetBoard);

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


  var edgeClick = function(event) {

    var edgeRow = parseInt(event.target.className.substring(3,4));
    var edgeCol = parseInt(event.target.className.substring(4,5));
    var boxIndex = {};

    var playerOneScoreDiv = document.querySelector('.p1-score');
    var playerTwoScoreDiv = document.querySelector('.p2-score');

    if (event.target.className.includes('he')) {
      if (edgeRow == 1) {
        boxIndex[0] = "" + edgeRow + edgeCol;
      } else if (edgeRow == (parseInt(rows.value) + 1)) {
        boxIndex[0] = "" + (edgeRow - 1) + edgeCol;
      } else {
        boxIndex[0] = "" + (edgeRow - 1) + edgeCol;
        boxIndex[1] = "" + edgeRow + edgeCol;
      }
    }

    if (event.target.className.includes('ve')) {
      if (edgeCol == 1) {
        boxIndex[0] = "" + edgeRow + edgeCol;
      } else if (edgeCol == (parseInt(cols.value) + 1)) {
        boxIndex[0] = "" + edgeRow + (edgeCol - 1);
      } else {
        boxIndex[0] = "" + edgeRow + (edgeCol - 1);
        boxIndex[1] = "" + edgeRow + edgeCol;
      }
    }

    // Refactor into method to loop over all box indices
    boxValues[boxIndex[0]]['numberFilled']++;
    if (boxValues[boxIndex[0]]['numberFilled'] == 4) {
      if (firstPlayerTurn) {
        playerOneScore++;
        document.querySelector('.box-' + boxIndex[0]).className = 'box-' + boxIndex[0] + ' player-1';
        playerOneScoreDiv.innerHTML = 'Player One Score: ' + playerOneScore;
      } else {
        playerTwoScore++;
        document.querySelector('.box-' + boxIndex[0]).className = 'box-' + boxIndex[0] + ' player-2';
        playerTwoScoreDiv.innerHTML = 'Player Two Score: ' + playerTwoScore;
      }
      scored = true;
    }
    if (boxValues[boxIndex[1]]) {
      boxValues[boxIndex[1]]['numberFilled']++;

      if (boxValues[boxIndex[1]]['numberFilled'] == 4) {
        if (firstPlayerTurn) {
          playerOneScore++;
          document.querySelector('.box-' + boxIndex[1]).className = 'box-' + boxIndex[0] + ' player-1';
          playerOneScoreDiv.innerHTML = 'Player One Score: ' + playerOneScore;
        } else {
          playerTwoScore++;
          document.querySelector('.box-' + boxIndex[1]).className = 'box-' + boxIndex[1] + ' player-2';
          playerTwoScoreDiv.innerHTML = 'Player Two Score: ' + playerTwoScore;
        }
        scored = true;
      }
    }
    //

    this.style.backgroundColor = '#000';
    this.className = event.target.className.substring(0,5);
    this.removeEventListener('click', edgeClick);

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
    scored = false;

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

      document.getElementsByClassName('play-again')[0].addEventListener('click', playAgainReset);

    }

  }

  let resetBoard = function() {
    boxValues = {};
    firstPlayerTurn = true;
    playAgain = false;
    playerOneScore = 0;
    playerTwoScore = 0;

    var gameContainer = document.querySelector('.game-container')
    while (gameContainer.hasChildNodes()) {
      gameContainer.removeChild(gameContainer.firstChild);
    }

    var scoreBoardDiv = document.querySelector('.score-board');
    var gameboardResetDiv = document.querySelector('.gameboard-reset');
    scoreBoardDiv.remove();
    gameboardResetDiv.remove();

    var gameOver = document.querySelector('.game-over')
    if (gameOver) {
      gameOver.remove();
    }

    var gameSetupDiv = document.createElement('div');
    document.querySelector('.input-container').appendChild(gameSetupDiv);
    gameSetupDiv.className = 'game-setup';


    var gameboardInput = document.createElement('div');
    document.querySelector('.game-setup').appendChild(gameboardInput);
    gameboardInput.className = 'gameboard-input-rows';

    var rowsLabel = document.createElement('label');
    gameboardInput.appendChild(rowsLabel);
    rowsLabel.innerHTML = 'Rows:  ';
    rowsLabel.setAttribute('for', 'rows');

    var rowsInput = document.createElement('input');
    gameboardInput.appendChild(rowsInput);
    rowsInput.setAttribute('type', 'number');
    rowsInput.setAttribute('class', 'form-control rows');
    rowsInput.setAttribute('name', 'rows');
    rowsInput.setAttribute('min', '1');
    rowsInput.setAttribute('max', '8');
    rowsInput.setAttribute('placeholder', '1');



    var gameboardInput2 = document.createElement('div');
    document.querySelector('.game-setup').appendChild(gameboardInput2);
    gameboardInput2.className = 'gameboard-input-cols';

    var colsLabel = document.createElement('label');
    gameboardInput2.appendChild(colsLabel);
    colsLabel.innerHTML = 'Columns:  ';
    colsLabel.setAttribute('for', 'cols');

    var colsInput = document.createElement('input');
    gameboardInput2.appendChild(colsInput);
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

    document.querySelector('.gameboard-submit').addEventListener('click', setupBoard);

  }

  let playAgainReset = function() {
    boxValues = {};
    firstPlayerTurn = true;
    playAgain = true;
    resetGame = false;
    playerOneScore = 0;
    playerTwoScore = 0;

    var gameContainer = document.querySelector('.game-container')
    while (gameContainer.hasChildNodes()) {
      gameContainer.removeChild(gameContainer.firstChild);
    }

    var gameOver = document.querySelector('.game-over');
    gameOver.remove();

    var playerOneScoreDiv = document.querySelector('.p1-score');
    var playerTwoScoreDiv = document.querySelector('.p2-score');

    playerOneScoreDiv.innerHTML = 'Player One Score: 0';
    playerTwoScoreDiv.innerHTML = 'Player Two Score: 0';

    setupBoard();
  }

  document.querySelector('.gameboard-submit').addEventListener('click', setupBoard);

});
