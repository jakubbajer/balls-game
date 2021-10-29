import Square from "./Square";

class Validator {
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
      console.log(toCheck);
      possible = toCheck.some(square => {
        return square.type === "empty";
      });
    } catch (e) {
      console.log(e);
    }

    return possible;
  }

  static validateMove() { }
}

export default Validator;