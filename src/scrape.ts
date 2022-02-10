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

const extractContentFromArticlePage = (
  page: import("node-html-parser").HTMLElement
) => {
  const blocks: any[] = [];
  const metadata: any = { similarTo: [], usedFor: [], keywords: [] };

  const content = page.querySelector(".mw-parser-output");

  content?.childNodes.forEach((node) => {
    if (node instanceof HTMLElement) {
      if (node.id === "ibox") {
        node.querySelectorAll(".ibox-level-cefr-hsk a").forEach((a, i) => {
          if (i === 0) {
            metadata.cefrLevel = a.innerText.trim();
          } else {
            metadata.hskLevel = a.innerText.trim();
          }
        });
        node.querySelectorAll(".ibox-similarto .smw-row").forEach((row) => {
          const link = row.querySelector("a");
          const url = link?.getAttribute("href");
          const title = link?.innerText.trim();
          const cefrLevel = row
            .querySelectorAll(".smw-value")[1]
            .innerText.trim();
          metadata.similarTo.push({
            url,
            title,
            cefrLevel,
          });
        });
        node.querySelectorAll(".ibox-usedfor a").forEach((link) => {
          const url = link?.getAttribute("href");
          const title = link?.innerText.trim();
          metadata.usedFor.push({
            url,
            title,
          });
        });
        node.querySelectorAll(".ibox-keywords a").forEach((link) => {
          metadata.keywords.push(link.innerText.trim());
        });

        console.log("METADATA", metadata);
      }
      if (node.tagName === "P") {
        blocks.push({ type: "paragraph", html: node.innerHTML });
      }
      if (node.tagName === "UL") {
        blocks.push({ type: "unordered-list", html: node.innerHTML });
      }
      if (node.classList.contains("jiegou")) {
        blocks.push({ type: "jiegou", text: node.innerText });
      }
      if (node.tagName === "H2") {
        blocks.push({
          type: "heading",
          level: 2,
          html: node.innerHTML,
          text: node.text,
        });
      }
      if (node.tagName === "H3") {
        blocks.push({
          type: "heading",
          level: 3,
          html: node.innerHTML,
          text: node.text,
        });
      }
      if (node.tagName === "H4") {
        blocks.push({
          type: "heading",
          level: 4,
          html: node.innerHTML,
          text: node.text,
        });
      }
      if (node.classList.contains("liju")) {
        const examples: any[] = [];

        node.querySelectorAll("li").forEach((exampleNode) => {
          const example: any = {
            chineseWords: [],
          };

          if (exampleNode.classList.contains("x")) {
            example.specialType = "incorrect";
          }
          if (exampleNode.classList.contains("o")) {
            example.specialType = "correction";
          }
          if (exampleNode.querySelector(".speaker")) {
            example.specialType = "dialogue";
          }

          exampleNode.childNodes.forEach((child) => {
            const addWordsWithAttributes = (attributes: any = {}) => {
              const words = child.innerText
                .trim()
                .replaceAll("，", " ， ")
                .replaceAll("。", " 。 ")
                .replaceAll("？", " ？ ")
                .split(" ");
              words.forEach((word) => {
                if (word !== "") {
                  example.chineseWords.push({ chars: word, ...attributes });
                }
              });
            };

            if (child instanceof TextNode) {
              addWordsWithAttributes();
            }
            if (child instanceof HTMLElement && child.tagName === "EM") {
              addWordsWithAttributes({ emphasis: true });
            }
            if (child instanceof HTMLElement && child.tagName === "STRONG") {
              addWordsWithAttributes({ strong: true });
            }
            if (
              child instanceof HTMLElement &&
              child.tagName === "SPAN" &&
              child.classList.contains("expl")
            ) {
              example.explanation = child.innerText;
            }
            if (
              child instanceof HTMLElement &&
              child.tagName === "SPAN" &&
              child.classList.contains("pinyin")
            ) {
              example.pinyin = child.innerText.trim();
            }
            if (
              child instanceof HTMLElement &&
              child.tagName === "SPAN" &&
              child.classList.contains("trans")
            ) {
              example.english = child.innerText;
            }
          });

          // console.log("words", example.chineseWords);

          examples.push(example);
        });

        // console.log(examples);

        blocks.push({
          type: "exampleSet",
          children: examples,
        });
      }
    }
  });

  return blocks;
};

const scrapeLevel = async (level: string) => {
  const url = `https://resources.allsetlearning.com/chinese/grammar/${level}_grammar_points`;
  const page = await fetchAndParse(url);
  const links = extractLinksFromListPage(page);

  const articles: any[] = [];

  for (const link of links) {
    const page = await fetchAndParse(
      `https://resources.allsetlearning.com${link.url}`
    );
    const blocks = extractContentFromArticlePage(page);

    console.log("Parsed article:", link.title);

    articles.push({
      url: link.url,
      title: link.title,
      pattern: link.pattern,
      blocks,
    });
  }

  fs.writeFileSync(`src/articles/${level}.json`, JSON.stringify(articles));
};

const levels = ["A1", "A2", "B1", "B2", "C1"];

// scrapeLevel("A1");

(async () => {
  const page = await fetchAndParse(
    "https://resources.allsetlearning.com/chinese/grammar/Expressing_distance_with_%22li%22"
  );
  const content = extractContentFromArticlePage(page);
  // console.log(content);
})();
