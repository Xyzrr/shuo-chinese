import * as S from "./ChineseRenderer.styles";

interface ChineseRendererProps {
  words: any[];
}

const ChineseRenderer: React.FC<ChineseRendererProps> = ({ words }) => {
  return (
    <div>
      {words.map((word, i) => (
        <S.WordWrapper key={i}>
          <S.Pinyin>{word.pinyin}</S.Pinyin>
          <S.Chars>{word.chars}</S.Chars>
        </S.WordWrapper>
      ))}
    </div>
  );
};

export default ChineseRenderer;
