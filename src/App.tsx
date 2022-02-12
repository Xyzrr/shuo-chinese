import * as S from "./App.styles";
import React from "react";
import A1 from "./parsed/A1.json";
import ChineseRenderer from "./ChineseRenderer";
import GrammarArticleRenderer from "./GrammarArticleRenderer";
import SearchIcon from "@mui/icons-material/Search";
import EnglishRenderer from "./EnglishRenderer";
import MultiEnglishRenderer from "./MultiEnglishRenderer";
import MultiChineseRenderer from "./MultiChineseRenderer";

const cards: any[] = [];

A1.forEach((article) => {
  article.blocks.forEach((block: any) => {
    console.log("type", block.type);
    if (block.type === "exampleSet") {
      if (block.specialType === "dialogue") {
        let multiCard: any = {
          level: "A1",
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
            cards.push({ ...example, level: "A1", article: article.title });
          }
        });
      }
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

  const selectedCard = cards[selectedIndex];

  const sourceArticle = A1.find(
    (article) => article.title === cards[selectedIndex].article
  );

  const [reveal, setReveal] = React.useState<"none" | "answer" | "article">(
    "none"
  );

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          if (reveal !== "article") {
            e.preventDefault();
            setSelectedIndex((i) => Math.min(cards.length, i + 1));
          }
          break;
        case "ArrowUp":
          if (reveal !== "article") {
            e.preventDefault();
            setSelectedIndex((i) => Math.max(0, i - 1));
          }
          break;
        case "ArrowLeft":
          if (reveal === "article") {
            setReveal("answer");
          }
          if (reveal === "answer") {
            setReveal("none");
          }
          break;
        case "ArrowRight":
          if (reveal === "none") {
            setReveal("answer");
          }
          if (reveal === "answer") {
            setReveal("article");
            setTimeout(() => {
              articleRef.current?.focus();
            });
          }
          break;
        case "Escape":
          setReveal("none");
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  });

  const articleRef = React.useRef<HTMLDivElement>(null);

  return (
    <S.FullPage onClick={() => setReveal("none")}>
      <S.AppWrapper>
        <S.GlobalStyle />
        <S.EnglishWrapper>
          {cards.map((card, i) => (
            <S.EnglishItem
              key={i}
              reveal={reveal}
              onClick={(e) => {
                e.stopPropagation();
                if (selectedIndex === i) {
                  setReveal((r) => (r === "none" ? "answer" : "none"));
                } else {
                  setSelectedIndex(i);
                  setReveal("answer");
                }
              }}
              active={selectedIndex === i}
            >
              <S.EnglishItemInner>
                {card.multi ? (
                  <MultiEnglishRenderer children={card.children} />
                ) : (
                  <EnglishRenderer
                    english={card.english}
                    explanation={card.explanation}
                  />
                )}
              </S.EnglishItemInner>
              {selectedIndex === i &&
                reveal === "answer" &&
                sourceArticle != null && (
                  <S.AnswerWrapper onClick={(e) => e.stopPropagation()}>
                    {selectedCard.multi ? (
                      <MultiChineseRenderer children={selectedCard.children} />
                    ) : (
                      <ChineseRenderer
                        chineseWords={selectedCard.chineseWords}
                      />
                    )}
                    <S.ShowArticleButton
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("wtf");
                        setReveal("article");
                      }}
                    >
                      <SearchIcon fontSize="inherit" />
                      <span
                        dangerouslySetInnerHTML={{
                          __html: sourceArticle.pattern,
                        }}
                      ></span>
                    </S.ShowArticleButton>
                  </S.AnswerWrapper>
                )}
            </S.EnglishItem>
          ))}
        </S.EnglishWrapper>
        {reveal === "article" && (
          <S.GrammarArticleWrapper
            onClick={(e) => {
              e.stopPropagation();
            }}
            ref={articleRef}
            tabIndex={-1}
          >
            <GrammarArticleRenderer article={sourceArticle} />
          </S.GrammarArticleWrapper>
        )}
      </S.AppWrapper>
    </S.FullPage>
  );
};

export default App;
