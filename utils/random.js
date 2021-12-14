//For when i need a random number of 0 to size
const getRandomNumberOfSize = (size) => {
  return Math.floor(Math.random() * size + 1);
};

module.exports = {
  getRandomNumberOfSize,
};
