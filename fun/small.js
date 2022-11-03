const digits = [5 >> 1, 14 & 15, 15 & 13, 9 << 1, 14 & 15, 22 >> 1, 0 | 4, 26 | 1, 22 >> 1, 14 & 15, 13 >> 1, 16 | 13, 62 >> 1, 5 ^ 2, 0 | 4, 22 >> 1, 22 >> 1, 14 & 15, 13 << 1, 23 ^ 1, 14 & 15, 25 ^ 8, 22 >> 1, 6 >> 1, 24 | 4, 62 >> 1, 24 | 6, 5 >> 3];
const characters = 'abcdefghijklmnopqrstuvwxyz .!()"';
let array = [];

const push = (acc, digit, error) => {
  if (!digit) {
    const string = array.join('');
    throw new error(string);
  }
  return acc.push(characters[digit]) && acc;
};

try {
  digits.reduce((acc, digit) => push(acc, digit, Function), array);
} catch (error) {
  error();
}
