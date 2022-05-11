import React from "react";
import { SettingsContext } from "./App";
import * as S from "./ChineseRenderer.styles";
import AudioIcon from "@mui/icons-material/VolumeUp";
import StopIcon from "@mui/icons-material/Stop";
import { chineseTextToFilename } from "./card-utils";

let currentAudio: HTMLAudioElement | null;

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

  const [audioPlaying, setAudioPlaying] = React.useState(false);

  return (
    <S.Wrapper specialType={specialType}>
      {specialType === "correction" && <S.StyledCheckIcon />}
      {specialType === "incorrect" && <S.StyledXIcon />}
      {specialType === "q" && <S.StyledWarningIcon />}
      <S.InnerWrapper>
        <S.CharsAndAudioWrapper>
          <S.CharsWrapper>
            {chineseWords.map((word, i) => {
              const CharsComponent = word.strong
                ? S.StrongChars
                : word.emphasis
                ? S.EmphasisChars
                : S.Chars;

              return (
                <S.WordWrapper
                  key={i}
                  rightMargin={
                    i === chineseWords.length - 1 &&
                    !["。", "？", "！"].includes(word.chars)
                  }
                >
                  {settingsContext.showPinyin && (
                    <S.Pinyin>{word.pinyin || "\xa0"}</S.Pinyin>
                  )}
                  <CharsComponent>{word.chars}</CharsComponent>
                </S.WordWrapper>
              );
            })}
          </S.CharsWrapper>
          <S.AudioButton
            style={{
              marginTop: settingsContext.showPinyin ? 22 : 0 /* brittle */,
            }}
            playing={audioPlaying}
            onClick={async () => {
              if (audioPlaying) {
                currentAudio?.pause();
                return;
              }

              currentAudio?.pause();
              const thisAudio = new Audio(
                `https://storage.googleapis.com/shuo-chinese-audio-samples/${chineseTextToFilename(
                  chineseWords.map((w) => w.chars).join("")
                )}.mp3`
              );
              currentAudio = thisAudio;
              setAudioPlaying(true);
              await thisAudio.play();
              thisAudio.onended = () => {
                setAudioPlaying(false);
              };
              thisAudio.onpause = () => {
                setAudioPlaying(false);
              };
            }}
          >
            {audioPlaying ? <StopIcon /> : <AudioIcon />}
          </S.AudioButton>
        </S.CharsAndAudioWrapper>
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
