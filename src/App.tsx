import * as S from "./App.styles";
import React from "react";
import A1 from "./articles/A1.json";
import ChineseRenderer from "./ChineseRenderer";
import GrammarArticleRenderer from "./GrammarArticleRenderer";
import SearchIcon from "@mui/icons-material/Search";
import EnglishRenderer from "./EnglishRenderer";
import MultiEnglishRenderer from "./MultiEnglishRenderer";
import MultiChineseRenderer from "./MultiChineseRenderer";
import split from "pinyin-split";

const cards: any[] = [];

const attachPinyinToChinese = (pinyin: string, chineseWords: any[]) => {
  const splitPinyin = split(pinyin);
  console.log("splitPinyin", pinyin, splitPinyin, chineseWords);
  let pinyinIndex = 0;
  chineseWords.forEach((word) => {
    const notChars = ["，", "。", "？"];
    if (!notChars.includes(word.chars)) {
      word.pinyin = splitPinyin
        .slice(pinyinIndex, pinyinIndex + word.chars.length)
        .join("");
      pinyinIndex += word.chars.length;
      console.log(
        "pinyinIndex",
        pinyinIndex,
        word.chars.length,
        word.chars,
        word.pinyin
      );
    }
  });
};

A1.forEach((article) => {
  article.blocks.forEach((block) => {
    if (block.type === "exampleSet") {
      let isDialogue = false;
      block.children?.forEach((example: any) => {
        if (example.specialType === "dialogue") {
          isDialogue = true;
        }
      });
      if (isDialogue) {
        let multiCard: any = {
          level: "A1",
          article: article.title,
          multi: true,
          children: [],
        };
        block.children?.forEach((example: any) => {
          if (example.chineseWords.length > 0 && example.english) {
            attachPinyinToChinese(example.pinyin, example.chineseWords);
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
            attachPinyinToChinese(example.pinyin, example.chineseWords);
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

  return (
    <S.AppWrapper onClick={() => setReveal("none")}>
      <S.GlobalStyle />
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
                    <ChineseRenderer chineseWords={selectedCard.chineseWords} />
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
        >
          <GrammarArticleRenderer article={sourceArticle} />
        </S.GrammarArticleWrapper>
      )}
    </S.AppWrapper>
  );
};

export default App;
