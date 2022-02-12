import { parse, HTMLElement, TextNode } from "node-html-parser";
import A1 from "./scraped/A1.json";
import A2 from "./scraped/A2.json";
import B1 from "./scraped/B1.json";
import B2 from "./scraped/B2.json";
import C1 from "./scraped/C1.json";
import fetch from "node-fetch";
import fs from "fs";

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

        // console.log("METADATA", metadata);
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

          if (exampleNode.classList.contains("q")) {
            // ???
            example.specialType = "q";
          }
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
                .replaceAll("、", " 、 ")
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

  return { blocks, metadata };
};

const levelMap: { [key: string]: any[] } = {
  A1: A1,
  A2: A2 as any,
  B1: B1 as any,
  B2: B2 as any,
  C1: C1,
};

const parseLevel = (level: keyof typeof levelMap) => {
  const articles = [];

  for (const article of levelMap[level]) {
    const { url, title, pattern } = article;

    const page = parse(article.html);
    const { blocks, metadata } = extractContentFromArticlePage(page);

    articles.push({ url, title, pattern, blocks, metadata });
  }

  fs.writeFileSync(`./src/parsed/${level}.json`, JSON.stringify(articles));
};

parseLevel("A1");
