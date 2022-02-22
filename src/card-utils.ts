import A1 from "./parsed/A1.json";
import A2 from "./parsed/A2.json";
import B1 from "./parsed/B1.json";
import B2 from "./parsed/B2.json";
import C1 from "./parsed/C1.json";

const articleSets: any[][] = [A1, A2, B1, B2, C1];

export const extractCards = (level: number) => {
  const articleSet = articleSets[level];
  const cards: any[] = [];

  articleSet.forEach((article) => {
    article.blocks.forEach((block: any) => {
      if (block.type === "exampleSet") {
        if (block.specialType === "dialogue") {
          let multiCard: any = {
            level,
            article: article.title,
            multi: true,
            children: [],
          };
          block.children?.forEach((example: any) => {
            if (example.chineseWords.length > 0 && example.english) {
              multiCard.children.push(example);
            }
          });
          if (multiCard.children.length > 0) {
            cards.push(multiCard);
          }
        } else {
          block.children?.forEach((example: any) => {
            if (
              !example.specialType &&
              example.chineseWords.length > 0 &&
              example.english
            ) {
              cards.push({ ...example, level, article: article.title });
            }
          });
        }
      }
    });
  });

  return cards;
};

export const articleFromCard = (card: any) => {
  return articleSets[card.level].find(
    (article) => article.title === card.article
  );
};

export const chineseTextToFilename = (text: string) => {
  return text.replace("/", "slash");
};
