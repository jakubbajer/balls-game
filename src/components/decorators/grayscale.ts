const grayscale = () => {
  const grays = ["#000000", "#222222", "#444444", "#666666", "#888888", "#AAAAAA", "#BBBBBB"];

  return (target: { colors: string[], [key: string]: any; }, key: string) => {
    Object.defineProperty(target, key, {
      value: grays
    });
  };
};

export default grayscale;