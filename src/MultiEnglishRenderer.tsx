import React from "react";
import EnglishRenderer from "./EnglishRenderer";
import * as S from "./MultiEnglishRenderer.styles";

interface MultiEnglishRendererProps {
  children: any[];
}

const MultiEnglishRenderer: React.FC<MultiEnglishRendererProps> = ({
  children,
}) => {
  return (
    <>
      {children.map((child, i) => {
        return (
          <S.Child key={i}>
            {child.speaker && <S.Prefix>{child.speaker}: </S.Prefix>}
            <EnglishRenderer
              english={child.english}
              explanation={child.explanation}
            />
          </S.Child>
        );
      })}
    </>
  );
};

export default MultiEnglishRenderer;
