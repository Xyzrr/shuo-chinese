import { parse, HTMLElement, TextNode } from "node-html-parser";
import A1 from "./src/scraped/A1.json";
import A2 from "./src/scraped/A2.json";
import B1 from "./src/scraped/B1.json";
import B2 from "./src/scraped/B2.json";
import C1 from "./src/scraped/C1.json";
import fs from "fs";
import split from "pinyin-split";

const attachPinyinToChinese = (pinyin: string, chineseWords: any[]) => {
  const chineseCharGroups = chineseWords.map((word) =>
    word.chars.toLowerCase()
  );

  const normalSplit = pinyin.replace(/[.,?!/]/g, "").split(" ");
  const splitPinyin: string[] = [];
  const strippedEnglish: string[] = [];
  normalSplit.forEach((chunk) => {
    const splitted = split(chunk);

    const probablyEnglish = chineseCharGroups.includes(chunk.toLowerCase());
    if (probablyEnglish) {
      strippedEnglish.push(chunk);
      return;
    }

    if (splitted.join("") + "r" === chunk) {
      // catch all the "nar", "dianr", "yihuir", etc.
      splitPinyin.push(...splitted, "r");
      return;
    }

    splitPinyin.push(...splitted);
  });
  let pinyinIndex = 0;

  chineseWords.forEach((word) => {
    const isPunctuation = ["，", "。", "？", "、", "！", "⋯", "/"].includes(
      word.chars
    );
    if (isPunctuation) {
      return;
    }

    const containsEnglish = strippedEnglish.includes(word.chars);
    if (containsEnglish) {
      return;
    }

    let syllables = word.chars.length;

    const containsNumbers = /[0-9]/.test(word.chars);
    if (containsNumbers) {
      const parsed = parseInt(word.chars);
      if (parsed > 20 && parsed < 100 && parsed % 10 !== 0) {
        syllables++;
      }

      if (word.chars.includes("%")) {
        syllables += 2;
      }
    }

    word.pinyin = splitPinyin
      .slice(pinyinIndex, pinyinIndex + syllables)
      .join("");
    pinyinIndex += syllables;
  });
};

const extractContentFromArticlePage = (
  page: import("node-html-parser").HTMLElement
) => {
  const blocks: any[] = [];
  const metadata: any = { similarTo: [], usedFor: [], keywords: [] };

  page.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href && href.startsWith("/")) {
      a.setAttribute("href", `https://resources.allsetlearning.com${href}`);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noreferrer");
    }
  });

  const content = page.querySelector(".mw-parser-output");

  const recurse = (topNode: HTMLElement, inLiju: boolean) => {
    topNode.childNodes.forEach((blockNode) => {
      if (!(blockNode instanceof HTMLElement)) {
        return;
      }

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
      }
      if (blockNode.tagName === "P") {
        blocks.push({ type: "paragraph", html: blockNode.innerHTML });
      }
      if (blockNode.tagName === "OL") {
        blocks.push({
          type: "list",
          html: blockNode.innerHTML,
          ordered: true,
        });
      }
      if (blockNode.tagName === "UL" && !inLiju) {
        blocks.push({
          type: "list",
          html: blockNode.innerHTML,
          ordered: false,
        });
      }
      if (blockNode.tagName === "TABLE") {
        blocks.push({
          type: "table",
          html: blockNode.innerHTML,
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

      if (blockNode.tagName === "UL" && inLiju) {
        const block: any = {
          type: "exampleSet",
          children: [],
        };

        if (blockNode.classList.contains("dialog")) {
          block.specialType = "dialogue";
        }

        blockNode.querySelectorAll("li").forEach((exampleNode) => {
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
          const speakerNode = exampleNode.querySelector(".speaker");
          if (speakerNode) {
            example.speaker = speakerNode.innerText.trim().slice(0, -1);
            speakerNode.remove();
          }

          if (blockNode.classList.contains("liju-en")) {
            example.english = exampleNode.innerText;
          } else {
            exampleNode.childNodes.forEach((exampleChild) => {
              const addWordsWithAttributes = (attributes: any = {}) => {
                const words = exampleChild.innerText
                  .trim()
                  .replaceAll("&#160;", " ")
                  .replaceAll("、", " 、 ")
                  .replaceAll("，", " ， ")
                  .replaceAll("。", " 。 ")
                  .replaceAll("？", " ？ ")
                  .replaceAll("！", " ！ ")
                  .replaceAll("⋯", " ⋯ ")
                  .split(" ");
                words.forEach((word) => {
                  if (word !== "") {
                    example.chineseWords.push({
                      chars: word,
                      ...attributes,
                    });
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
                example.english = exampleChild.innerText;
              }
            });
          }

          block.children.push(example);
        });
        blocks.push(block);
      }

      if (blockNode.classList.contains("liju")) {
        recurse(blockNode, true);
      }
    });
  };

  if (content) {
    recurse(content, false);
  }

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

const levels = ["A1", "A2", "B1", "B2", "C1"];

for (const level of levels) {
  parseLevel(level);
}

// parseLevel("A1");
