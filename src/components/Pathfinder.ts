import PathfindNode from "./PathfindNode";
import Square from "./Square";

class Pathfinder {
  openList: PathfindNode[];
  closedList: PathfindNode[];
  end: Square;
  start: PathfindNode;
  board: Square[][];

  constructor(start: Square, end: Square, board: Square[][]) {
    this.start = new PathfindNode(start, start, 0);
    this.board = board;
    this.end = end;
    this.openList = [];
    this.closedList = [];

    this.init();
  }

  private init() {
    this.closedList.push(this.start);
    this.openList.push(...this.getPossibleSquares(this.start));

    let best: PathfindNode = this.scoreOpenList()!;

    // continuing the search 4. A*
    this.closedList.push(best);
  }

  private scoreOpenList() {
    this.openList.forEach(node => {
      let xDist = Math.abs(this.end.x - node.square.x);
      let yDist = Math.abs(this.end.y - node.square.y);
      let hScore = xDist + yDist;
      node.fScore = hScore + node.gScore;
    });

    this.openList.sort((a, b) => {
      if (a.fScore && b.fScore)
        return a.fScore - b.fScore;
      else return 1;
    });

    return this.openList.shift();
  }

  private getPossibleSquares(fromSquare: PathfindNode): PathfindNode[] {
    let possible: PathfindNode[] = [];
    let x = fromSquare.square.x;
    let y = fromSquare.square.y;

    if (this.board[x - 1] && this.board[x - 1][y].type === "empty")
      possible.push(new PathfindNode(this.board[x - 1][y], fromSquare.square, fromSquare.gScore + 1));
    if (this.board[x + 1] && this.board[x + 1][y].type === "empty")
      possible.push(new PathfindNode(this.board[x + 1][y], fromSquare.square, fromSquare.gScore + 1));
    if (this.board[x][y - 1] && this.board[x][y - 1].type === "empty")
      possible.push(new PathfindNode(this.board[x][y - 1], fromSquare.square, fromSquare.gScore + 1));
    if (this.board[x][y + 1] && this.board[x][y - 1].type === "empty")
      possible.push(new PathfindNode(this.board[x][y + 1], fromSquare.square, fromSquare.gScore + 1));

    return possible;
  }


  static isMovePossible(board: Square[][], x: number, y: number) {
    let possible;
    try {
      let toCheck: Square[] = [];
      if (board[x - 1])
        toCheck.push(board[x - 1][y]);
      if (board[x + 1])
        toCheck.push(board[x + 1][y]);
      if (board[x][y - 1])
        toCheck.push(board[x][y - 1]);
      if (board[x][y + 1])
        toCheck.push(board[x][y + 1]);
      possible = toCheck.some(square => {
        return square.type === "empty";
      });
    } catch (e) {
      console.log(e);
    }

    return possible;
  }
}

export default Pathfinder;