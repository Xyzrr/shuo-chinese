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
            <S.Prefix>{String.fromCharCode("A".charCodeAt(0) + i)}: </S.Prefix>
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
