import Game from './components/Game';
import './main.css';

let gameContainer: HTMLDivElement = document.querySelector("#game")!;
const game = new Game(gameContainer);
game.init();