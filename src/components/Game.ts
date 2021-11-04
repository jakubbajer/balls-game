import Square from "./Square";
import Pathfinder from "./Pathfinder";
import NextBall from "./interfaces/NextBall";

class Game {
  container: HTMLDivElement;
  nextContainer: HTMLDivElement;
  scoreContainer: HTMLDivElement;
  board: Square[][];
  colors: string[];
  selected: Square | undefined;
  pathfinder: Pathfinder | undefined;
  nextBalls: NextBall[];
  paused: boolean;

  constructor(container: HTMLDivElement) {
    this.colors = ["#008B8B", "#FF8C00", "#006400",
      "#BDB76B", "#E9967A", "#8B0000", "#483D8B"];
    this.container = container;
    this.nextContainer = document.querySelector("#nextBalls")!;
    this.scoreContainer = document.querySelector("#score")!;
    this.board = this.getBoard();
    this.nextBalls = [];
    this.paused = false;
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
    this.nextBalls = this.getNewBalls();
    this.nextBalls.forEach(nextBall => {
      this.addBall(nextBall.color);
    });
    this.nextBalls = this.getNewBalls();
    this.displayNextBalls();
  }

  clickHandler(x: number, y: number) {
    if (!this.paused) {
      if (this.board[x][y].type === "ball" && Pathfinder.isMovePossible(this.board, x, y)) {
        if (x === this.selected?.x && y === this.selected.y) {
          this.selected.ball?.makeSmall();
          this.clearBackgrounds();
          this.selected = undefined;
        } else {
          this.selected = this.board[x][y];
          this.board.forEach(row => {
            row.forEach(square => {
              if (square.ball)
                square.ball.makeSmall();
            });
          });
          this.clearBackgrounds();
          this.selected.ball?.makeBig();
        }
      } else {
        // make move
        if (this.selected && this.pathfinder && this.pathfinder.canMove) {
          this.clearBackgrounds();
          this.board[x][y].type = "ball";
          this.board[x][y].ball = this.selected.ball;
          this.board[x][y].color = this.selected.color;
          this.board[x][y].update();
          this.selected.clear();
          this.selected = undefined;
          this.paused = true;
          let path = this.pathfinder.getPath();
          path.forEach(square => {
            square.div.style.backgroundColor = "#CCCCCC";
          });
          this.delay(500)
            .then(() => {
              this.clearBackgrounds();
              this.nextBalls.forEach(nextBall => {
                this.addBall(nextBall.color);
              });
              this.nextBalls = this.getNewBalls();
              this.displayNextBalls();
              this.paused = false;
            });
        }
        else if (this.pathfinder && !this.pathfinder.canMove) { }
        else this.selected = undefined;
      }
    }
  }

  getNewBalls(): NextBall[] {
    let balls: NextBall[] = [];
    for (let i = 0; i < 3; i++) {
      balls.push({ id: i, color: this.colors[Math.floor(Math.random() * 7)] });
    }
    return balls;
  }

  addBall(color: string) {
    if (this.board.some(row => {
      return row.some(square => square.type === "empty");
    })) {
      const randomX = Math.floor(Math.random() * 9);
      const randomY = Math.floor(Math.random() * 9);
      let square = this.board[randomX][randomY];
      if (square.type === "empty") {
        square.type = "ball";
        square.color = color;
        square.update();
      } else {
        this.addBall(color);
      }
    } else {
      console.warn("Game end!");
    }
  }

  displayNextBalls() {
    this.nextBalls.forEach((ball, index) => {
      this.nextContainer.children[index].innerHTML = "";
      let div = document.createElement("div");
      div.className = "ball";
      div.style.backgroundColor = ball.color;
      this.nextContainer.children[index].append(div);
    });
  }

  hoverHandler(square: Square) {
    if (!this.paused && this.selected)
      this.pathfinder = new Pathfinder(this.selected, square, this.board);
  }

  clearBackgrounds() {
    this.board.forEach(row => {
      row.forEach(square => square.div.style.backgroundColor = "");
    });
  }

  delay = (ms: number) => new Promise(res => setTimeout(res, ms));
}

export default Game;