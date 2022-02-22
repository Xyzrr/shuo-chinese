import React from "react";
import { SettingsContext } from "./App";
import * as S from "./ChineseRenderer.styles";
import AudioIcon from "@mui/icons-material/VolumeUp";

interface ChineseRendererProps {
  chineseWords: any[];
  english?: string;
  specialType?: string;
  explanation?: string;
}

const ChineseRenderer: React.FC<ChineseRendererProps> = ({
  chineseWords,
  english,
  specialType,
  explanation,
}) => {
  const settingsContext = React.useContext(SettingsContext);

  return (
    <S.Wrapper specialType={specialType}>
      {specialType === "correction" && <S.StyledCheckIcon />}
      {specialType === "incorrect" && <S.StyledXIcon />}
      {specialType === "q" && <S.StyledWarningIcon />}
      <S.InnerWrapper>
        {chineseWords.map((word, i) => {
          const CharsComponent = word.strong
            ? S.StrongChars
            : word.emphasis
            ? S.EmphasisChars
            : S.Chars;
          return (
            <S.WordWrapper key={i}>
              {settingsContext.showPinyin && (
                <S.Pinyin>{word.pinyin || "\xa0"}</S.Pinyin>
              )}
              <CharsComponent>{word.chars}</CharsComponent>
            </S.WordWrapper>
          );
        })}
        <S.WordWrapper>
          {/* Filler pinyin to guarantee alignment */}
          {settingsContext.showPinyin && <S.Pinyin>{"\xa0"}</S.Pinyin>}
          <S.AudioButton>
            <AudioIcon />
          </S.AudioButton>
        </S.WordWrapper>
        {english && (
          <S.English>
            {english}
            {explanation && ` (${explanation})`}
          </S.English>
        )}
      </S.InnerWrapper>
    </S.Wrapper>
  );
};

export default ChineseRenderer;
