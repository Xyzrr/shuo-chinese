import { parse, HTMLElement, TextNode } from "node-html-parser";
import A1 from "./scraped/A1.json";
import A2 from "./scraped/A2.json";
import B1 from "./scraped/B1.json";
import B2 from "./scraped/B2.json";
import C1 from "./scraped/C1.json";
import fs from "fs";
import split from "pinyin-split";

const attachPinyinToChinese = (pinyin: string, chineseWords: any[]) => {
  const splitPinyin = split(pinyin);
  let pinyinIndex = 0;
  chineseWords.forEach((word) => {
    const notChars = ["，", "。", "？", "、"];
    if (!notChars.includes(word.chars)) {
      word.pinyin = splitPinyin
        .slice(pinyinIndex, pinyinIndex + word.chars.length)
        .join("");
      pinyinIndex += word.chars.length;
    }
  });
};

const extractContentFromArticlePage = (
  page: import("node-html-parser").HTMLElement
) => {
  const blocks: any[] = [];
  const metadata: any = { similarTo: [], usedFor: [], keywords: [] };

  const content = page.querySelector(".mw-parser-output");

  content?.childNodes.forEach((blockNode) => {
    if (blockNode instanceof HTMLElement) {
      if (blockNode.id === "ibox") {
        blockNode.querySelectorAll(".ibox-level-cefr-hsk a").forEach((a, i) => {
          if (i === 0) {
            metadata.cefrLevel = a.innerText.trim();
          } else {
            metadata.hskLevel = a.innerText.trim();
          }
        });
        blockNode
          .querySelectorAll(".ibox-similarto .smw-row")
          .forEach((row) => {
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
        blockNode.querySelectorAll(".ibox-usedfor a").forEach((link) => {
          const url = link?.getAttribute("href");
          const title = link?.innerText.trim();
          metadata.usedFor.push({
            url,
            title,
          });
        });
        blockNode.querySelectorAll(".ibox-keywords a").forEach((link) => {
          metadata.keywords.push(link.innerText.trim());
        });

        // console.log("METADATA", metadata);
      }
      if (blockNode.tagName === "P") {
        blocks.push({ type: "paragraph", html: blockNode.innerHTML });
      }
      if (blockNode.tagName === "OL") {
        blocks.push({ type: "list", html: blockNode.innerHTML, ordered: true });
      }
      if (blockNode.tagName === "UL") {
        blocks.push({
          type: "list",
          html: blockNode.innerHTML,
          ordered: false,
        });
      }
      if (blockNode.classList.contains("jiegou")) {
        blocks.push({ type: "jiegou", text: blockNode.innerText });
      }
      if (blockNode.tagName === "H2") {
        blocks.push({
          type: "heading",
          level: 2,
          html: blockNode.innerHTML,
          text: blockNode.text,
        });
      }
      if (blockNode.tagName === "H3") {
        blocks.push({
          type: "heading",
          level: 3,
          html: blockNode.innerHTML,
          text: blockNode.text,
        });
      }
      if (blockNode.tagName === "H4") {
        blocks.push({
          type: "heading",
          level: 4,
          html: blockNode.innerHTML,
          text: blockNode.text,
        });
      }
      if (blockNode.classList.contains("liju")) {
        blockNode.childNodes.forEach((lijuChild) => {
          if (lijuChild instanceof HTMLElement && lijuChild.tagName === "P") {
            blocks.push({ type: "paragraph", html: blockNode.innerHTML });
          }
          if (lijuChild instanceof HTMLElement && lijuChild.tagName === "UL") {
            const block: any = {
              type: "exampleSet",
              children: [],
            };

            if (lijuChild.classList.contains("dialog")) {
              block.specialType = "dialogue";
            }

            lijuChild.querySelectorAll("li").forEach((exampleNode) => {
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
              const speaker = exampleNode.querySelector(".speaker");
              if (speaker) {
                example.speaker = speaker.innerText.trim().slice(0, -1);
              }

              exampleNode.childNodes.forEach((exampleChild) => {
                const addWordsWithAttributes = (attributes: any = {}) => {
                  const words = exampleChild.innerText
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

                if (exampleChild instanceof TextNode) {
                  addWordsWithAttributes();
                }
                if (
                  exampleChild instanceof HTMLElement &&
                  exampleChild.tagName === "EM"
                ) {
                  addWordsWithAttributes({ emphasis: true });
                }
                if (
                  exampleChild instanceof HTMLElement &&
                  exampleChild.tagName === "STRONG"
                ) {
                  addWordsWithAttributes({ strong: true });
                }
                if (
                  exampleChild instanceof HTMLElement &&
                  exampleChild.tagName === "SPAN" &&
                  exampleChild.classList.contains("expl")
                ) {
                  example.explanation = exampleChild.innerText;
                }
                if (
                  exampleChild instanceof HTMLElement &&
                  exampleChild.tagName === "SPAN" &&
                  exampleChild.classList.contains("pinyin")
                ) {
                  attachPinyinToChinese(
                    exampleChild.innerText.trim(),
                    example.chineseWords
                  );
                }
                if (
                  exampleChild instanceof HTMLElement &&
                  exampleChild.tagName === "SPAN" &&
                  exampleChild.classList.contains("trans")
                ) {
                  if (exampleChild.innerText === "Are you a college student?") {
                    console.log("OFFENDER:");
                  }
                  example.english = exampleChild.innerText;
                }
              });

              block.children.push(example);
            });
            blocks.push(block);
          }
        });

        // console.log(examples);
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

  console.log(`${level} done`);
};

console.log("Loaded modules, parsing...");

parseLevel("A1");
