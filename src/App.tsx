import * as S from "./App.styles";
import React from "react";
import A1 from "./articles/A1.json";
import ChineseRenderer from "./ChineseRenderer";
import GrammarArticleRenderer from "./GrammarArticleRenderer";

const cards: any[] = [];

A1.forEach((article) => {
  article.blocks.forEach((block) => {
    if (block.type === "exampleSet") {
      block.children?.forEach((example: any) => {
        if (!example.specialType) {
          example.chineseWords.forEach((word: any) => {
            word.chars = word.chars.replace("？", "?");
          });
          cards.push({ ...example, level: "A1", article: article.title });
        }
      });
    }
  });
});

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

shuffleArray(cards);

const App: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const sourceArticle = A1.find(
    (article) => article.title === cards[selectedIndex].article
  );

  const [reveal, setReveal] = React.useState("none");

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => Math.min(cards.length, i + 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) => Math.max(0, i - 1));
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
  }, []);

  console.log("reveal", reveal);

  return (
    <S.AppWrapper onClick={() => setReveal("none")}>
      <S.GlobalStyle />

      {reveal === "article" && (
        <S.GrammarArticleWrapper
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <GrammarArticleRenderer article={sourceArticle} />
        </S.GrammarArticleWrapper>
      )}
      <S.EnglishWrapper>
        {cards.map((card, i) => (
          <S.EnglishItem
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              console.log("selected", i);
              if (selectedIndex === i) {
                setReveal((r) => (r === "none" ? "answer" : "none"));
              } else {
                setSelectedIndex(i);
                setReveal("answer");
              }
            }}
            active={selectedIndex === i}
          >
            {selectedIndex === i && reveal === "answer" && (
              <S.AnswerWrapper onClick={(e) => e.stopPropagation()}>
                <ChineseRenderer words={cards[selectedIndex].chineseWords} />
                <S.ShowArticleButton
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("wtf");
                    setReveal("article");
                  }}
                >
                  {sourceArticle?.pattern}
                </S.ShowArticleButton>
              </S.AnswerWrapper>
            )}
            <S.EnglishItemInner>{card.english}</S.EnglishItemInner>
          </S.EnglishItem>
        ))}
      </S.EnglishWrapper>
    </S.AppWrapper>
  );
};

export default App;
