import { parse, HTMLElement, TextNode } from "node-html-parser";

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

          console.log(example);

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

const baseURL = "https://resources.allsetlearning.com";
const a1URL =
  "https://resources.allsetlearning.com/chinese/grammar/A1_grammar_points";

// const listPage = await fetchAndParse(a1URL);
// const links = extractLinksFromListPage(listPage);

const articleURL =
  "https://resources.allsetlearning.com/chinese/grammar/Continuation_with_%22hai%22";

const articlePage = fetchAndParse(articleURL).then((articlePage) => {
  const content = extractContentFromArticlePage(articlePage);
  // console.log("content", content);
});
