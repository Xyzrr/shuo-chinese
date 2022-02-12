import ChineseRenderer from "./ChineseRenderer";
import * as S from "./MultiChineseRenderer.styles";

interface MultiChineseRendererProps {
  children: any[];
}

const MultiChineseRenderer: React.FC<MultiChineseRendererProps> = ({
  children,
}) => {
  return (
    <>
      {children.map((child, i) => {
        return (
          <S.Child key={i}>
            {child.speaker && <S.Prefix>{child.speaker}: </S.Prefix>}
            <ChineseRenderer chineseWords={child.chineseWords} />
          </S.Child>
        );
      })}
    </>
  );
};

export default MultiChineseRenderer;
