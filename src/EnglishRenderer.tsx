import React from "react";
import * as S from "./EnglishRenderer.styles";
import Highlighter from "react-highlight-words";

interface EnglishRendererProps {
  english: string;
  explanation: string;
  searchString?: string;
}

const EnglishRenderer: React.FC<EnglishRendererProps> = ({
  english,
  explanation,
  searchString,
}) => {
  return (
    <S.Wrapper>
      {searchString ? (
        <Highlighter searchWords={[searchString]} textToHighlight={english} />
      ) : (
        english
      )}
      {explanation && <S.Explanation>({explanation})</S.Explanation>}
    </S.Wrapper>
  );
};

export default EnglishRenderer;
