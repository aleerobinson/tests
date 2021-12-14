const arr = [
  {id: 1, name: 'one'},
  {id: 2, name: 'two'},
  {id: 3, name: 'three'},
];

const addToAcc = (user, acc) => {
  const {id, name} = user;
  acc[id] = name;
};

const res = arr.reduce((acc, user) => {
  addToAcc(user, acc);

  return acc;
}, {});

console.log(res);
