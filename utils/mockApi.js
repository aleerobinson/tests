//When i only want to simulate a wait of x milliseconds
const apiAwait = (waitTimeInMs) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(waitTimeInMs), waitTimeInMs);
  });
};

module.exports = {
  apiAwait,
};
