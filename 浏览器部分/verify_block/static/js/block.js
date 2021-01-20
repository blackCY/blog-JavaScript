const arr = [];

for (let i = 0; i < 10000000; i++) {
  arr.push(i);
  arr.splice(i % 3, i % 5, i % 7);
}

console.log(1111);
