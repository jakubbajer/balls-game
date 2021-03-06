import Ball from "./Ball";

class Square {
  readonly x: number;
  readonly y: number;
  type: "empty" | "ball";
  div: HTMLDivElement;
  color: string;
  ball: Ball | undefined;
  clickCallback: Function;
  hoverCallback: Function;

  constructor(x: number, y: number, clickCallback: Function, hoverCallback: Function) {
    this.div = document.createElement("div");
    this.clickCallback = clickCallback;
    this.hoverCallback = hoverCallback;
    this.color = "";
    this.type = "empty";
    this.x = x;
    this.y = y;
    this.div.setAttribute("x", this.x.toString());
    this.div.setAttribute("y", this.y.toString());
    this.div.classList.add("square");
    this.div.addEventListener("click", () => this.clickCallback(this.x, this.y));
    this.div.addEventListener("mouseover", () => this.hoverCallback(this));
  }

  addDiv(container: HTMLDivElement) {
    container.append(this.div);
  }

  update() {
    if (this.color !== "") {
      this.div.innerHTML = "";
      this.ball = new Ball(this.color);
      this.div.append(this.ball.div);
    } else {
      this.ball = undefined;
      this.div.innerHTML = "";
    }
  }

  clear() {
    this.type = "empty";
    this.color = "";
    this.update();
  }
}

export default Square;