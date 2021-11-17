import Game from "../Game";

function mock() {
  return function (target: Game, key: string, descriptor: PropertyDescriptor) {
    const oryginal = descriptor.value;
    const goodMessages = ["Super!", "Awesome job!", "You're doing great!"];
    const badMessages = ["Lame!", "A child would do a better job!", "lmao L nerd"];

    descriptor.value = function (...args: any) {
      const result = oryginal.apply(this, args);
      const random = Math.floor(Math.random() * 3);
      if (result) {
        alert(goodMessages[random]);
      } else {
        alert(badMessages[random]);
      }

      return result;
    };
  };
};

export default mock;