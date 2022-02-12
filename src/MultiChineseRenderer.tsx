import ChineseRenderer from "./ChineseRenderer";
import * as S from "./MultiChineseRenderer.styles";

interface MultiChineseRendererProps {
  children: any[];
  hideEnglish?: boolean;
}

const MultiChineseRenderer: React.FC<MultiChineseRendererProps> = ({
  children,
  hideEnglish,
}) => {
  return (
    <>
      {children.map((child, i) => {
        return (
          <S.Child key={i}>
            {child.speaker && <S.Prefix>{child.speaker}: </S.Prefix>}
            <ChineseRenderer
              chineseWords={child.chineseWords}
              english={hideEnglish ? undefined : child.english}
            />
          </S.Child>
        );
      })}
    </>
  );
};

export default MultiChineseRenderer;
