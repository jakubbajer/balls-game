import PathfindNode from "../PathfindNode";

interface CheckIfIsOnList {
  (x: number, y: number, list: PathfindNode[]): boolean;
}

export default CheckIfIsOnList;