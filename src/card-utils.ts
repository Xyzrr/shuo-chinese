import A1 from "./parsed/A1.json";
import A2 from "./parsed/A2.json";
import B1 from "./parsed/B1.json";
import B2 from "./parsed/B2.json";
import C1 from "./parsed/C1.json";

export const LEVEL_NAMES = ["A1", "A2", "B1", "B2", "C1"];

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

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export const allCards: any[] = [];
for (let i = 0; i < articleSets.length; i++) {
  const cards = extractCards(i);
  allCards.push(...cards);
}
shuffleArray(allCards);

export const articleFromCard = (card: any) => {
  return articleSets[card.level].find(
    (article) => article.title === card.article
  );
};

export const chineseTextToFilename = (text: string) => {
  return text.replaceAll("/", "slash");
};
