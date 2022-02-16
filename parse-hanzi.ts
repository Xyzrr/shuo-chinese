import fs from "fs";

try {
  const data = fs.readFileSync("./hanzi.txt", "utf8");

  const lines = data.split("\n");
  const parsed: any = {};
  for (const line of lines) {
    try {
      if (line.length > 0) {
        const json = JSON.parse(line);
        parsed[json.character] = json;
      }
    } catch (err) {
      console.error("Failed to parse line:", line);
      console.error(err);
    }
  }
  fs.writeFileSync(`./src/hanzi.json`, JSON.stringify(parsed));
  console.log("Parsed", lines.length, "lines.");
} catch (err) {
  console.error(err);
}
