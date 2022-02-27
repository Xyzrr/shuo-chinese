import React from "react";
import * as S from "./EnglishRenderer.styles";

interface EnglishRendererProps {
  english: string;
  explanation: string;
}

const EnglishRenderer: React.FC<EnglishRendererProps> = ({
  english,
  explanation,
}) => {
  return (
    <>
      {english}
      {explanation && <S.Explanation>({explanation})</S.Explanation>}
    </>
  );
};

export default EnglishRenderer;
