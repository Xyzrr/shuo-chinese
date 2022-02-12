import * as S from "./App.styles";
import React from "react";
import A1 from "./parsed/A1.json";
import A2 from "./parsed/A2.json";
import B1 from "./parsed/B1.json";
import B2 from "./parsed/B2.json";
import C1 from "./parsed/C1.json";
import ChineseRenderer from "./ChineseRenderer";
import GrammarArticleRenderer from "./GrammarArticleRenderer";
import SearchIcon from "@mui/icons-material/Search";
import EnglishRenderer from "./EnglishRenderer";
import MultiEnglishRenderer from "./MultiEnglishRenderer";
import MultiChineseRenderer from "./MultiChineseRenderer";
import { createTheme, ThemeProvider, Popper } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const articleSets: any[][] = [A1, A2, B1, B2, C1];

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const extractCards = (level: number) => {
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

const App: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const [levels, setLevels] = React.useState<number[]>([1, 2]);

  const cards = React.useMemo(() => {
    let result: any[] = [];
    for (let i = levels[0]; i <= levels[1]; i++) {
      result.push(...extractCards(i));
    }
    shuffleArray(result);
    result = result.slice(0, 50);
    return result;
  }, [levels]);

  const selectedCard = cards[selectedIndex];

  const sourceArticle = React.useMemo(() => {
    return articleSets[selectedCard.level].find(
      (article) => article.title === selectedCard.article
    );
  }, [selectedCard]);

  const [reveal, setReveal] = React.useState<"none" | "answer" | "article">(
    "none"
  );

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          if (reveal !== "article") {
            e.preventDefault();
            setSelectedIndex((i) => Math.min(cards.length - 1, i + 1));
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

  const [settingsAnchorEl, setSettingsAnchorEl] =
    React.useState<SVGElement | null>(null);

  const handleSettingsClick = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
    setSettingsAnchorEl(settingsAnchorEl ? null : e.currentTarget);
  };

  const open = Boolean(settingsAnchorEl);

  return (
    <ThemeProvider theme={darkTheme}>
      <S.FullPage
        onClick={() => {
          setReveal("none");
        }}
      >
        <S.AppWrapper>
          <S.GlobalStyle />
          <S.SettingsButton />
          <Popper
            open={open}
            anchorEl={settingsAnchorEl}
            placement="left-start"
          >
            <S.SettingsWrapper>
              <S.StyledSlider
                size="small"
                value={levels}
                onChange={(e, value) => {
                  const v = value as number[];
                  if (v[0] !== levels[0] || v[1] !== levels[1]) setLevels(v);
                }}
                min={0}
                max={4}
                step={1}
                marks={[
                  { value: 0, label: "A1" },
                  { value: 1, label: "A2" },
                  { value: 2, label: "B1" },
                  { value: 3, label: "B2" },
                  { value: 4, label: "C1" },
                ]}
              />
            </S.SettingsWrapper>
          </Popper>
          <S.SettingsButton onClick={handleSettingsClick} />
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
                        <MultiChineseRenderer
                          children={selectedCard.children}
                          hideEnglish
                        />
                      ) : (
                        <ChineseRenderer
                          chineseWords={selectedCard.chineseWords}
                        />
                      )}
                      <S.ShowArticleButton
                        onClick={(e) => {
                          e.stopPropagation();
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
    </ThemeProvider>
  );
};

export default App;
