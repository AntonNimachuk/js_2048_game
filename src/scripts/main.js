'use strict';
/* TODO:
1) квадарти мають бути рызних ввідповідних кольорів.
2) Після оновлення сторінки гра запускатись немає.
3) має пропадати після початку гри : (Press "Start" to begin game. Good luck!)
*/
// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here

import Game from '../modules/Game.class.js';

// DOM-елементи
const boardElement = document.querySelector('.game-field');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

// Старт гри
let game = null;

startButton.addEventListener('click', () => {
  game = new Game();

  game.restart();
  render();
  // Приховати стартове повідомлення після початку гри
  messageStart.classList.add('hidden');

  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
});

// Відображення повідомлень
function showMessage(someStatus) {
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (someStatus === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (someStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (someStatus === 'start') {
    messageStart.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (someEvent) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (someEvent.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    default:
      return;
  }

  render();

  if (game.getStatus() === 'win') {
    showMessage('win');
  }

  if (game.getStatus() === 'lose') {
    showMessage('lose');
  }
});

function render() {
  const board = game.getState();
  const score = game.getScore();

  const rows = boardElement.querySelectorAll('.field-row');

  rows.forEach((rowEl, rowIdx) => {
    const cells = rowEl.querySelectorAll('.field-cell');

    cells.forEach((cellEl, colIdx) => {
      const value = board[rowIdx][colIdx];

      cellEl.textContent = value === 0 ? '' : value;
      cellEl.className = 'field-cell';

      if (value !== 0) {
        cellEl.classList.add(`field-cell--${value}`);
      }
    });
  });

  scoreElement.textContent = score;
}

render();
