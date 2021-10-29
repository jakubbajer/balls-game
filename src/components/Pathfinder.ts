import PathfindNode from "./PathfindNode";
import Square from "./Square";

class Pathfinder {
  openList: PathfindNode[];
  closedList: PathfindNode[];
  start: Square;
  end: Square;
  current: PathfindNode;
  board: Square[][];
  canMove: boolean;

  constructor(start: Square, end: Square, board: Square[][]) {
    this.start = start;
    this.current = new PathfindNode(start, start, 0);
    this.board = board;
    this.end = end;
    this.openList = [this.current];
    this.closedList = [];
    this.canMove = true;

    console.log("Start");
    if (start !== end)
      this.findNextBest();
  }

  private findNextBest() {
    // Look for the lowest F cost square on the open list and switch it to the closed list.
    this.current = this.scoreOpenList()!;

    this.openList.push(...this.getPossibleSquares(this.current));
    this.closedList.push(this.current);

    //  For each of the 4 squares adjacent to this current square...
    if (this.current.square.x === this.end.x && this.current.square.y === this.end.y) {
      this.getPath();

      console.log("End");
    } else
      this.findNextBest();
  }

  getPath() {
    let last = this.closedList.find(node => node.square.x === this.end.x && node.square.y === this.end.y)!;
    let path: Square[] = [];
    path.push(last.square);
    do {
      console.log("loop");
      last = this.closedList.find(node => node.square.x === last.parent.x && node.square.y === last.parent.y)!;
      path.push(last.square);
    } while (last.parent.div !== this.start.div);
    path.push(this.start);
    this.clearBackgrounds();
    path.forEach(square => {
      square.div.style.backgroundColor = "#CCCCCC";
    });
  }

  clearBackgrounds() {
    this.board.forEach(row => {
      row.forEach(square => square.div.style.backgroundColor = "");
    });
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

  // TODO: repair working at top and left, clicking on a no access square
  private getPossibleSquares(fromNode: PathfindNode): PathfindNode[] {
    let possible: PathfindNode[] = [];
    let x = fromNode.square.x!;
    let y = fromNode.square.y!;
    let toCheck;
    if (x && y)
      toCheck = [{ x: x - 1, y: y }, { x: x + 1, y: y }, { x: x, y: y - 1 }, { x: x, y: y + 1 }];

    //  For each of the 4 squares adjacent to this current square...
    if (toCheck)
      toCheck.forEach(squareCoords => {
        if ((this.board[squareCoords.x] && this.board[squareCoords.x][squareCoords.y] && this.board[squareCoords.x][squareCoords.y].type === "empty" && squareCoords.x && squareCoords.y)                // If it exist and is empty and...
          && !this.checkIfIsOnList(squareCoords.x, squareCoords.y, this.closedList)) {                                                                  // if it isn't on the closed list, do:
          let newNode = new PathfindNode(this.board[squareCoords.x][squareCoords.y], fromNode.square, fromNode.gScore + 1);
          if (!this.checkIfIsOnList(squareCoords.x, squareCoords.y, this.openList))                                                                     // if it isn't on the open list
            possible.push(newNode);                                                                                                                     // add it to the open list
          else {                                                                                                                                        // if it is,         // find it and check to see if it's path to it is better
            let duplicateNodeIndex = this.openList.findIndex((node) => node.square.x === squareCoords.x && node.square.y === squareCoords.y)!;
            let isBetter = newNode.gScore > this.openList[duplicateNodeIndex].gScore;
            if (isBetter) {                                                                                                                             // If so,
              this.openList[duplicateNodeIndex].parent = fromNode.square;                                                                               // change the parent of the square to the current square
              let found = this.openList.find(node => {
                this.openList[duplicateNodeIndex].parent === node.square;
              })!;
              this.openList[duplicateNodeIndex].gScore = (found.gScore) ? found.gScore + 1 : 0;
              let xDist = Math.abs(this.end.x - this.openList[duplicateNodeIndex].square.x);
              let yDist = Math.abs(this.end.y - this.openList[duplicateNodeIndex].square.y);
              let hScore = xDist + yDist;
              this.openList[duplicateNodeIndex].fScore = hScore + this.openList[duplicateNodeIndex].gScore;
              this.openList.sort((a, b) => {
                if (a.fScore && b.fScore)
                  return a.fScore - b.fScore;
                else return 1;
              });
            }
          }
        }
      });

    return possible;
  }

  private checkIfIsOnList(x: number, y: number, list: PathfindNode[]): boolean {
    return list.some((node, index) => node.square.x === x && node.square.y === y);
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