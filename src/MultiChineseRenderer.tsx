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
            <S.Prefix>{String.fromCharCode("A".charCodeAt(0) + i)}: </S.Prefix>
            <ChineseRenderer chineseWords={child.chineseWords} />
          </S.Child>
        );
      })}
    </>
  );
};

export default MultiChineseRenderer;
