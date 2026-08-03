const arr = [['a', 2], ['b', 3]];
const s = `outer ${arr.length ? arr.map(([x, n]) => `${x} — ${n}x`).join(', ') : 'none'} end`;
console.log(s);
