const {getArrayOfSize} = require('../utils/array');
const firstNames = require('./firstNames');

const size = 1000;
const users = getArrayOfSize(size).map((_, i) => {
  const mod = i % 1000;
  const userID = i + 1;

  const firstName = firstNames[mod];
  const lastName = `Last-${userID}`;

  return {
    id: userID,
    firstName,
    lastName,
  };
});
console.log(users);
