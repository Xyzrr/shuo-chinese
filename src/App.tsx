import * as S from "./App.styles";
import React, { useEffect } from "react";

import GrammarArticleRenderer from "./GrammarArticleRenderer";

import { createTheme, ThemeProvider, Popper } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import XIcon from "@mui/icons-material/Clear";
import Checkbox from "@mui/material/Checkbox";
import ChinesePopup from "./ChinesePopup";
import { extractCards, articleFromCard, allCards } from "./card-utils";
import InteractiveExample from "./InteractiveExample";

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
  const [searchString, setSearchString] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      if (e.key === "f" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
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

    result = result.slice(0, 50);

    return result;
  }, [levels, searchString, searching]);

  const [filteredSearchedCards, otherSearchedCards] = React.useMemo(() => {
    if (!searching || searchString === "") {
      return [[], []];
    }

    let filteredCards = allCards.filter(
      (c: any) => c.level >= levels[0] && c.level <= levels[1]
    );
    let otherCards = allCards.filter(
      (c: any) => c.level < levels[0] || c.level > levels[1]
    );

    const lowercased = searchString.toLowerCase();
    const filterFunc = (c: any) => {
      if (c.multi) {
        return false;
      }
      return (
        c.chineseWords
          .map((w: any) => w.chars)
          .join("")
          .toLowerCase()
          .includes(lowercased) || c.english.toLowerCase().includes(lowercased)
      );
    };

    filteredCards = filteredCards.filter(filterFunc);
    otherCards = otherCards.filter(filterFunc);

    filteredCards = filteredCards.slice(0, 50);
    otherCards = otherCards.slice(0, Math.max(50 - filteredCards.length, 0));

    return [filteredCards, otherCards];
  }, [cards, searchString, searching]);

  const displayedCards =
    searching && searchString !== ""
      ? filteredSearchedCards.concat(otherSearchedCards)
      : cards;

  const selectedCard = displayedCards[selectedIndex];

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
            setSelectedIndex((i) => Math.min(displayedCards.length - 1, i + 1));
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
                    value={searchString}
                    onChange={(e) => {
                      setSearchString(e.target.value);
                    }}
                  />
                </S.SearchWrapper>
              ) : (
                <S.Logo className="no-popup">
                  说 <strong>Chinese</strong>
                </S.Logo>
              )}
              {displayedCards.map((card, i) => (
                <>
                  {i === filteredSearchedCards.length &&
                    otherSearchedCards.length > 0 && (
                      <S.OtherResultsLabel>Other results</S.OtherResultsLabel>
                    )}
                  <InteractiveExample
                    key={i}
                    reveal={reveal}
                    searchString={searchString}
                    active={selectedIndex === i}
                    card={card}
                    searching={searching}
                    onClickEnglish={(e) => {
                      e.stopPropagation();
                      setSettingsAnchorEl(null);
                      if (selectedIndex === i) {
                        setReveal((r) => (r === "none" ? "answer" : "none"));
                      } else {
                        setSelectedIndex(i);
                        setReveal("answer");
                      }
                    }}
                    onClickShowArticle={(e) => {
                      e.stopPropagation();
                      setReveal("article");
                    }}
                    onClickAnswer={(e) => {
                      e.stopPropagation();
                      setSettingsAnchorEl(null);
                    }}
                  />
                </>
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
