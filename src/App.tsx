import * as S from "./App.styles";
import React from "react";
import A1 from "./articles/A1.json";
import ChineseRenderer from "./ChineseRenderer";

const cards: any[] = [];

A1.forEach((article) => {
  article.blocks.forEach((block) => {
    if (block.type === "exampleSet") {
      block.children?.forEach((example: any) => {
        if (!example.specialType) {
          cards.push({ ...example, level: "A1", article: article.title });
        }
      });
    }
  });
});

const App: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <div className="App">
      <S.EnglishWrapper>
        {cards.map((card, i) => (
          <S.EnglishItem
            key={i}
            onClick={() => {
              console.log("selected", i);
              setSelectedIndex(i);
            }}
            active={selectedIndex === i}
          >
            {card.english}
          </S.EnglishItem>
        ))}
      </S.EnglishWrapper>
    </div>
  );
};

export default App;
