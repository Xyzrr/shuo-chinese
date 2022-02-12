import { parse, HTMLElement, TextNode } from "node-html-parser";
import fetch from "node-fetch";
import fs from "fs";

const fetchAndParse = async (url: string) => {
  const result = await fetch(url);
  return parse(await result.text());
};

const extractLinksFromListPage = (page: HTMLElement) => {
  const links: any[] = [];

  page.querySelectorAll(".wikitable").forEach((table) => {
    table.querySelectorAll("tr").forEach((row) => {
      const th = row.querySelector("th");
      if (th) {
        return;
      }

      const linkCell = row.querySelector("td:first-child");
      const patternCell = row.querySelector("td:nth-child(2)");
      const linkNode = linkCell?.querySelector("a");
      const url = linkNode?.getAttribute("href");
      const title = linkNode?.innerText;
      const pattern = patternCell?.innerText;

      links.push({
        url,
        title,
        pattern,
      });
    });
  });

  return links;
};

const scrapeLevel = async (level: string) => {
  const url = `https://resources.allsetlearning.com/chinese/grammar/${level}_grammar_points`;
  const page = await fetchAndParse(url);
  const links = extractLinksFromListPage(page);

  const articles: any[] = [];

  for (const link of links) {
    const page = await fetch(`https://resources.allsetlearning.com${link.url}`);

    console.log("Scraped article:", link.title);

    articles.push({
      url: link.url,
      title: link.title,
      pattern: link.pattern,
      html: await page.text(),
    });
  }

  fs.writeFileSync(`src/scraped/${level}.json`, JSON.stringify(articles));
};

const levels = ["A2", "B1", "B2", "C1"];

for (const level of levels) {
  scrapeLevel(level);
}

// (async () => {
//   const page = await fetchAndParse(
//     "https://resources.allsetlearning.com/chinese/grammar/Expressing_distance_with_%22li%22"
//   );
//   const content = extractContentFromArticlePage(page);
//   // console.log(content);
// })();
