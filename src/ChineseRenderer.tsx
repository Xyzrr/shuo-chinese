import * as S from "./ChineseRenderer.styles";

interface ChineseRendererProps {
  chineseWords: any[];
}

const ChineseRenderer: React.FC<ChineseRendererProps> = ({ chineseWords }) => {
  return (
    <div>
      {chineseWords.map((word, i) => (
        <S.WordWrapper key={i}>
          <S.Pinyin>{word.pinyin || "\xa0"}</S.Pinyin>
          <S.Chars>{word.chars}</S.Chars>
        </S.WordWrapper>
      ))}
    </div>
  );
};

export default ChineseRenderer;
