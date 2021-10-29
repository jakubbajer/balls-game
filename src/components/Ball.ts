class Ball {
  readonly div: HTMLDivElement;

  constructor(color: string, big: boolean) {
    this.div = document.createElement("div");
    this.div.classList.add("ball");
    this.div.style.backgroundColor = color;
  }

  makeBig() {
    this.div.classList.add("big");
  }

  makeSmall() {
    this.div.classList.remove("big");
  }
}

export default Ball;