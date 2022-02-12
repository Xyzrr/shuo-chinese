import * as S from "./ChineseRenderer.styles";

interface ChineseRendererProps {
  chineseWords: any[];
  english?: string;
}

const ChineseRenderer: React.FC<ChineseRendererProps> = ({
  chineseWords,
  english,
}) => {
  return (
    <div>
      {chineseWords.map((word, i) => (
        <S.WordWrapper key={i}>
          <S.Pinyin>{word.pinyin || "\xa0"}</S.Pinyin>
          <S.Chars>{word.chars}</S.Chars>
        </S.WordWrapper>
      ))}
      {english && <S.English>{english}</S.English>}
    </div>
  );
};

export default ChineseRenderer;
