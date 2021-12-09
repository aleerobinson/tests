const {getArrayOfSize} = require('../utils/array');

//Under reduce since this is a common thing to do in reduce
const size = 100_000;
const users = getArrayOfSize(size).map((_, i) => {
  const userID = i + 1;
  const mod = userID % 10;

  return {
    id: userID,
    name: `user-${mod}`,
  };
});

console.time('run');
const userIdsByName = users.reduce((acc, {id, name}) => {
  if (!acc[name]) {
    acc[name] = [];
  }

  acc[name].push(id);
  // acc[name] = [...acc[name], id];

  return acc;
}, {});
console.timeEnd('run');

console.log(userIdsByName);
