import * as S from "./ChineseRenderer.styles";

interface ChineseRendererProps {
  chineseWords: any[];
  english?: string;
  specialType?: string;
}

const ChineseRenderer: React.FC<ChineseRendererProps> = ({
  chineseWords,
  english,
  specialType,
}) => {
  return (
    <S.Wrapper specialType={specialType}>
      {specialType === "correction" && <S.StyledCheckIcon />}
      {specialType === "incorrect" && <S.StyledXIcon />}
      <S.InnerWrapper>
        {chineseWords.map((word, i) => {
          const CharsComponent = word.emphasis
            ? S.EmphasisChars
            : word.strong
            ? S.StrongChars
            : S.Chars;
          return (
            <S.WordWrapper key={i}>
              <S.Pinyin>{word.pinyin || "\xa0"}</S.Pinyin>
              <CharsComponent>{word.chars}</CharsComponent>
            </S.WordWrapper>
          );
        })}
        {english && <S.English>{english}</S.English>}
      </S.InnerWrapper>
    </S.Wrapper>
  );
};

export default ChineseRenderer;
