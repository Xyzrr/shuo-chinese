import * as S from "./ChinesePopup.styles";
import React from "react";
import { WBPopup } from "./WBPopup";
import hanzi from "./hanzi.json";

interface ChinesePopupProps {}

const ChinesePopup: React.FC<ChinesePopupProps> = ({}) => {
  const [rect, setRect] = React.useState<DOMRect | null>(null);
  const [hanziValue, setHanziValue] = React.useState<any>(null);

  const lastNodeRef = React.useRef<Node | null>(null);
  const lastOffsetRef = React.useRef<number | null>(null);
  const lastText = React.useRef<string | null>(null);

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const caretRange = document.caretRangeFromPoint(e.pageX, e.pageY);

      if (
        !caretRange ||
        (lastNodeRef.current === caretRange.startContainer &&
          lastOffsetRef.current === caretRange.startOffset)
      ) {
        return;
      }

      lastNodeRef.current = caretRange.startContainer;
      lastOffsetRef.current = caretRange.startOffset;

      const sel = window.getSelection();
      const newRange = document.createRange();
      newRange.setStart(caretRange.startContainer, caretRange.startOffset);
      newRange.setEnd(caretRange.startContainer, caretRange.startOffset + 1);
      const hoveredText = newRange.toString();

      if (hoveredText === lastText.current) {
        return;
      }

      lastText.current = hoveredText;

      const foundHanzi = (hanzi as any)[hoveredText];

      if (foundHanzi) {
        sel?.empty();
        sel?.addRange(newRange);
        setRect(newRange.getBoundingClientRect());
        setHanziValue(foundHanzi);
      } else {
        sel?.empty();
        setRect(null);
        setHanziValue(null);
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onMouseMove);
    };
  });

  if (!rect || !hanziValue) {
    return null;
  }

  return (
    <>
      <WBPopup x={rect.left} y={rect.top} direction="top right">
        <S.Wrapper>
          <p>{hanziValue.pinyin}</p>
          <p>{hanziValue.definition}</p>
          <p>{JSON.stringify(hanziValue.etymology, null, 10)}</p>
        </S.Wrapper>
      </WBPopup>
    </>
  );
};

export default ChinesePopup;
