import React from "react";
import EnglishRenderer from "./EnglishRenderer";
import * as S from "./MultiEnglishRenderer.styles";

interface MultiEnglishRendererProps {
  children: any[];
  searchString?: string;
}

const MultiEnglishRenderer: React.FC<MultiEnglishRendererProps> = ({
  children,
  searchString,
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
              searchString={searchString}
            />
          </S.Child>
        );
      })}
    </>
  );
};

export default MultiEnglishRenderer;
