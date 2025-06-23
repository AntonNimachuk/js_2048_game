'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here
export class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'playing';

    this.board = initialState
      ? this.cloneBoard(initialState)
      : this.createEmptyBoard();

    if (!initialState) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  getState() {
    return this.cloneBoard(this.board);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
  }

  restart() {
    this.score = 0;
    this.status = 'playing';
    this.board = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
  }

  moveLeft() {
    return this.move(this.slideRowLeft.bind(this));
  }

  moveRight() {
    return this.move(this.slideRowRight.bind(this));
  }

  moveUp() {
    this.transpose();

    const moved = this.move(this.slideRowLeft.bind(this));

    this.transpose();

    return moved;
  }

  moveDown() {
    this.transpose();

    const moved = this.move(this.slideRowRight.bind(this));

    this.transpose();

    return moved;
  }

  move(slideFunction) {
    const oldBoard = this.cloneBoard(this.board);

    this.board = this.board.map((row) => slideFunction(row));

    if (!this.areBoardsEqual(oldBoard, this.board)) {
      this.addRandomTile();

      if (this.checkWin()) {
        this.status = 'win';
      } else if (!this.canMove()) {
        this.status = 'lose';
      }

      return true;
    }

    return false;
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  addRandomTile() {
    const empty = [];

    for (let i = 0; i < this.size; i++) {
      for (let k = 0; k < this.size; k++) {
        if (this.board[i][k] === 0) {
          empty.push({ i, k });
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const { r, c } = empty[Math.floor(Math.random() * empty.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  slideRowLeft(row) {
    const nonZero = row.filter((val) => val !== 0);
    const merged = [];

    for (let i = 0; i < nonZero.length; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        merged.push(nonZero[i] * 2);
        this.score += nonZero[i] * 2;
        i++;
      } else {
        merged.push(nonZero[i]);
      }
    }

    while (merged.length < this.size) {
      merged.push(0);
    }

    return merged;
  }

  slideRowRight(row) {
    return this.slideRowLeft([...row].reverse()).reverse();
  }

  transpose() {
    const newBoard = this.createEmptyBoard();

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        newBoard[c][r] = this.board[r][c];
      }
    }
    this.board = newBoard;
  }

  areBoardsEqual(a, b) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (a[i][j] !== b[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  canMove() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }

        if (c < this.size - 1 && this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }

        if (r < this.size - 1 && this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  checkWin() {
    return this.board.flat().includes(2048);
  }
}
