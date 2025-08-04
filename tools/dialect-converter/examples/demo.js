
const convertDialect = require("../index");

const input = "شلونك اليوم؟";

const output = convertDialect(input, { from: "iraqi", to: "msa" });

console.log(output); // كيف حالك اليوم؟

