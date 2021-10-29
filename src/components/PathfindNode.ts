import Square from "./Square";

class PathfindNode {
  fScore: number | undefined;
  square: Square;
  parent: Square;
  gScore: number;

  constructor(square: Square, parent: Square, gScore: number) {
    this.gScore = gScore;
    this.square = square;
    this.parent = parent;
  }
}

export default PathfindNode;