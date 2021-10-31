import Square from "./Square";
import Pathfinder from "./Pathfinder";

class Game {
  container: HTMLDivElement;
  board: Square[][];
  colors: string[];
  selected: Square | undefined;
  pathfinder: Pathfinder | undefined;

  constructor(container: HTMLDivElement) {
    this.colors = ["#008B8B", "#FF8C00", "#006400",
      "#BDB76B", "#E9967A", "#8B0000", "#483D8B"];
    this.container = container;
    this.board = this.getBoard();
  }

  private getBoard() {
    let board = [];
    for (let x = 0; x < 9; x++) {
      let arr = [];
      let row = document.createElement("div");
      row.classList.add("row");
      for (let y = 0; y < 9; y++) {
        const square = new Square(x, y, this.clickHandler.bind(this), this.hoverHandler.bind(this));
        square.addDiv(row);
        arr.push(square);
      }
      this.container.append(row);
      board.push(arr);
    }
    return board;
  }

  init() {
    this.getRandomBall();
    this.getRandomBall();
    this.getRandomBall();
  }

  getRandomBall() {
    const randomX = Math.floor(Math.random() * 9);
    const randomY = Math.floor(Math.random() * 9);
    const randomColor = this.colors[Math.floor(Math.random() * 7)];
    let square = this.board[randomX][randomY];
    if (square.type === "empty") {
      square.type = "ball";
      square.color = randomColor;
      square.update();
    } else {
      this.getRandomBall();
    }
  }

  clickHandler(x: number, y: number) {
    if (this.board[x][y].type === "ball" && Pathfinder.isMovePossible(this.board, x, y)) {
      this.selected = this.board[x][y];
      this.board.forEach(row => {
        row.forEach(square => {
          if (square.ball)
            square.ball.makeSmall();
        });
      });
      this.selected.ball?.makeBig();
    } else { // move selected ball to clicked square
      if (this.selected && this.pathfinder && this.pathfinder.canMove) {
        this.clearBackgrounds();
        this.board[x][y].type = "ball";
        this.board[x][y].ball = this.selected.ball;
        this.board[x][y].color = this.selected.color;
        this.board[x][y].update();
        this.selected.clear();
        this.selected = undefined;
      }
      else if (this.pathfinder && !this.pathfinder.canMove) { }
      else this.selected = undefined;
    }
  }

  hoverHandler(square: Square) {
    if (this.selected)
      this.pathfinder = new Pathfinder(this.selected, square, this.board);
  }

  clearBackgrounds() {
    this.board.forEach(row => {
      row.forEach(square => square.div.style.backgroundColor = "");
    });
  }
}

export default Game;