const assert = require("node:assert/strict");

const { calcolaTesseraSanitaria } = require("../script.js");

const result = calcolaTesseraSanitaria({
  eta0: 3,
  eta20: 5,
  left1: 4,
  top1: 6,
  left2: 1,
  top2: 2,
  left3: 9,
  top3: 3,
  centro: 7,
  right1: 8,
  bottom1: 10,
  eta40: 11,
  eta60: 12,
});

assert.deepEqual(
  result.righe.map((riga) => ({
    fisico: riga.fisico,
    energia: riga.energia,
    emozioni: riga.emozioni,
  })),
  [
    { fisico: 3, energia: 5, emozioni: 8 },
    { fisico: 4, energia: 6, emozioni: 10 },
    { fisico: 1, energia: 2, emozioni: 3 },
    { fisico: 9, energia: 3, emozioni: 12 },
    { fisico: 7, energia: 7, emozioni: 14 },
    { fisico: 8, energia: 10, emozioni: 18 },
    { fisico: 11, energia: 12, emozioni: 5 },
  ],
);

assert.equal(result.totaleFisico, 7);
assert.equal(result.totaleEnergia, 9);
assert.equal(result.totaleEmozioni, 7);

console.log("tesseraSanitaria test passed");
