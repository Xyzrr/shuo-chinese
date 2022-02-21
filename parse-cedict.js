const cedict =  require("./cedict.json");

try {
  const keys = Object.keys(cedict);
  const counter = {};
  const uniq = new Set();
  for (const key of keys) {
    if (counter[key.length] == null) {
      counter[key.length] = 1;
    } else {
      counter[key.length]++;
    }

    if (key.length === 15) {
      console.log(key)
      console.log(cedict[key])
    }
    for (const char of key) {
      uniq.add(char);
    }
  }
  console.log(counter)
  console.log(uniq.size)
  //   fs.writeFileSync(`./src/hanzi.json`, JSON.stringify(parsed));
} catch (err) {
  console.error(err);
}
