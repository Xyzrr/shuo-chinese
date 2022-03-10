import * as S from "./App.styles";
import React, { useEffect } from "react";

import ChineseRenderer from "./ChineseRenderer";
import GrammarArticleRenderer from "./GrammarArticleRenderer";
import EnglishRenderer from "./EnglishRenderer";
import MultiEnglishRenderer from "./MultiEnglishRenderer";
import MultiChineseRenderer from "./MultiChineseRenderer";
import { createTheme, ThemeProvider, Popper } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import XIcon from "@mui/icons-material/Clear";
import Checkbox from "@mui/material/Checkbox";
import ChinesePopup from "./ChinesePopup";
import { extractCards, articleFromCard, allCards } from "./card-utils";

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = true;
recognition.maxAlternatives = 1;

interface SettingsContextValue {
  showPinyin: boolean;
}

export const SettingsContext = React.createContext<SettingsContextValue>({
  showPinyin: true,
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const [levels, setLevels] = React.useState<number[]>([1, 2]);

  const [searching, setSearching] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      console.log("key", e.key, e.metaKey);
      if (e.key === "f" && e.metaKey && e.shiftKey) {
        e.preventDefault();
        setSearching(true);
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSearching(false);
      }
    };
    window.addEventListener("keydown", onKeyPress);
    return () => {
      window.removeEventListener("keydown", onKeyPress);
    };
  }, []);

  const cards = React.useMemo(() => {
    let result = allCards.filter(
      (c: any) => c.level >= levels[0] && c.level <= levels[1]
    );

    if (searching && searchText !== "") {
      const lowercased = searchText.toLowerCase();
      result = result.filter((c) => {
        if (c.multi) {
          return false;
        }
        return (
          c.chineseWords
            .map((w: any) => w.chars)
            .join("")
            .toLowerCase()
            .includes(lowercased) ||
          c.english.toLowerCase().includes(lowercased)
        );
      });
    }

    result = result.slice(0, 50);

    return result;
  }, [levels, searchText, searching]);

  const selectedCard = cards[selectedIndex];

  const sourceArticle = React.useMemo(() => {
    if (!selectedCard) {
      return null;
    }
    return articleFromCard(selectedCard);
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
    React.useState<HTMLElement | null>(null);

  const handleSettingsClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setSettingsAnchorEl(settingsAnchorEl ? null : e.currentTarget);
  };

  const open = Boolean(settingsAnchorEl);

  const [showPinyin, setShowPinyin] = React.useState(true);
  const [voiceControl, setVoiceControl] = React.useState(false);

  const [temp, setTemp] = React.useState("");

  return (
    <ThemeProvider theme={darkTheme}>
      <ChinesePopup />
      <SettingsContext.Provider value={{ showPinyin }}>
        <S.FullPage
          onClick={() => {
            setReveal("none");
            setSettingsAnchorEl(null);
          }}
        >
          <S.AppWrapper>
            <S.GlobalStyle />
            <Popper
              open={open}
              anchorEl={settingsAnchorEl}
              placement="left-start"
            >
              <S.SettingsWrapper onClick={(e) => e.stopPropagation()}>
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
                <S.StyledFormControlLabel
                  label="Show pinyin"
                  control={
                    <Checkbox
                      checked={showPinyin}
                      onChange={(e, checked) => {
                        setShowPinyin(checked);
                      }}
                    />
                  }
                />
                <S.StyledFormControlLabel
                  label="Voice control"
                  control={
                    <Checkbox
                      checked={voiceControl}
                      onChange={(e, checked) => {
                        setVoiceControl(checked);
                        if (checked) {
                          recognition.start();

                          const reset = () => {
                            recognition.onresult = undefined;
                            recognition.stop();
                          };

                          const onResult = (e: SpeechRecognitionEvent) => {
                            const result =
                              e.results[0][0].transcript.toLowerCase();
                            setTemp(
                              e.results[0][0].transcript +
                                "|" +
                                e.results[0][0].confidence
                            );
                            console.log("result", e);
                            if (result.includes("next")) {
                              reset();
                              setSelectedIndex((i) =>
                                Math.min(cards.length - 1, i + 1)
                              );
                            }
                            if (result.includes("previous")) {
                              reset();
                              setSelectedIndex((i) => Math.max(0, i - 1));
                            }
                            if (result.includes("chinese")) {
                              reset();
                              setReveal("answer");
                            }
                            if (result.includes("english")) {
                              reset();
                              setReveal("none");
                            }
                          };

                          recognition.onresult = onResult;

                          recognition.onend = (e: any) => {
                            window.setTimeout(() => {
                              recognition.start();
                              recognition.onresult = onResult;
                            }, 2000);
                          };
                        } else {
                          recognition.onend = () => {};
                          recognition.stop();
                        }
                      }}
                    />
                  }
                />
              </S.SettingsWrapper>
            </Popper>
            <S.SettingsButton onClick={handleSettingsClick}>
              <SettingsIcon />
            </S.SettingsButton>
            <S.EnglishWrapper>
              {searching ? (
                <S.SearchWrapper>
                  <S.StyledSearchIcon />
                  <S.SearchInput
                    ref={searchInputRef}
                    autoFocus
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                    }}
                  />
                </S.SearchWrapper>
              ) : (
                <S.Logo className="no-popup">
                  说 <strong>Chinese</strong>
                </S.Logo>
              )}
              {cards.map((card, i) => (
                <S.EnglishItem
                  key={i}
                  reveal={reveal}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSettingsAnchorEl(null);
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
                      <S.AnswerWrapper
                        onClick={(e) => {
                          e.stopPropagation();
                          setSettingsAnchorEl(null);
                        }}
                      >
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
                          className="no-popup"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReveal("article");
                          }}
                        >
                          <S.ArticleLevelIndicator level={selectedCard.level} />
                          <span
                            dangerouslySetInnerHTML={{
                              __html: sourceArticle.pattern,
                            }}
                          />
                        </S.ShowArticleButton>
                      </S.AnswerWrapper>
                    )}
                </S.EnglishItem>
              ))}
            </S.EnglishWrapper>
            {reveal === "article" && (
              <S.GrammarArticleWrapper
                onScroll={() => {
                  window.dispatchEvent(new Event("scroll"));
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                ref={articleRef}
                tabIndex={-1}
              >
                <S.CloseArticleButton
                  onClick={() => {
                    setReveal("answer");
                  }}
                >
                  <XIcon />
                </S.CloseArticleButton>
                <GrammarArticleRenderer article={sourceArticle} />
              </S.GrammarArticleWrapper>
            )}
          </S.AppWrapper>
        </S.FullPage>
      </SettingsContext.Provider>
    </ThemeProvider>
  );
};

export default App;
