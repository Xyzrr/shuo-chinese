const fs = require("fs");
const cedict = require("./cedict-original.json");
const utils = require("pinyin-utils");

try {
  const keys = Object.keys(cedict);
  const result = {};

  keys.forEach((key) => {
    if (cedict[key].s) {
      return;
    }
    if (key.length === 1) {
      return;
    }

    const originalDefs = cedict[key].d;
    const cloned = {};

    Object.keys(originalDefs).forEach((defKey) => {
      const markedPinyin = utils.numberToMark(defKey.split(" ")).join(" ");
      cloned[markedPinyin] = originalDefs[defKey];
    });

    result[key] = cloned;
  });

  fs.writeFileSync(`./src/cedict.json`, JSON.stringify(result));
} catch (err) {
  console.error(err);
}
