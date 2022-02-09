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

  const content = page.querySelector(".mw-parser-output");

  content?.childNodes.forEach((node) => {
    if (node instanceof HTMLElement) {
      if (node.tagName === "P") {
        blocks.push({ type: "paragraph", html: node.innerHTML });
      }
      if (node.tagName === "UL") {
        blocks.push({ type: "unordered-list", html: node.innerHTML });
      }
      if (node.classList.contains("jiegou")) {
        blocks.push({ type: "jiegou", html: node.innerHTML });
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
            if (child instanceof TextNode) {
              const words = child.innerText
                .trim()
                .replaceAll(" ，", "，")
                .replaceAll("，", "， ")
                .replaceAll(" 。", "。")
                .replaceAll("。", "。 ")
                .replaceAll(" ？", "？")
                .replaceAll("？", "？ ")
                .split(" ");
              words.forEach((word) => {
                if (word !== "") {
                  example.chineseWords.push({ chars: word });
                }
              });
            }
            if (child instanceof HTMLElement && child.tagName === "EM") {
              const words = child.innerText.trim().split(" ");
              words.forEach((word) => {
                example.chineseWords.push({ chars: word, emphasis: true });
              });
            }
            if (child instanceof HTMLElement && child.tagName === "STRONG") {
              const words = child.innerText.trim().split(" ");
              words.forEach((word) => {
                example.chineseWords.push({ chars: word, strong: true });
              });
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
              const words = child.innerText.trim().split(" ");
              words.forEach((word, i) => {
                if (example.chineseWords[i]) {
                  example.chineseWords[i].pinyin = word;
                }
              });
            }
            if (
              child instanceof HTMLElement &&
              child.tagName === "SPAN" &&
              child.classList.contains("trans")
            ) {
              example.english = child.innerText;
            }
          });

          examples.push(example);
        });

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
      title: link.title,
      pattern: link.pattern,
      blocks,
    });
  }

  fs.writeFileSync(`src/articles/${level}.json`, JSON.stringify(articles));
};

const levels = ["A1", "A2", "B1", "B2", "C1"];

scrapeLevel("A1");
