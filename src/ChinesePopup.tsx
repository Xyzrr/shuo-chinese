import * as S from "./ChinesePopup.styles";
import React from "react";
import { WBPopup } from "./WBPopup";
import hanzi from "./hanzi.json";

interface ChinesePopupProps {}

const ChinesePopup: React.FC<ChinesePopupProps> = () => {
  const [rect, setRect] = React.useState<DOMRect | null>(null);
  const [hanziValue, setHanziValue] = React.useState<any>(null);

  const lastNodeRef = React.useRef<Node | null>(null);
  const lastOffsetRef = React.useRef<number | null>(null);
  const lastText = React.useRef<string | null>(null);

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const caretRange = document.caretRangeFromPoint(e.clientX, e.clientY);

      if (
        !caretRange ||
        (lastNodeRef.current === caretRange.startContainer &&
          lastOffsetRef.current === caretRange.startOffset)
      ) {
        return;
      }

      lastNodeRef.current = caretRange.startContainer;
      lastOffsetRef.current = caretRange.startOffset;

      const newRange = document.createRange();
      newRange.setStart(caretRange.startContainer, caretRange.startOffset);
      try {
        newRange.setEnd(caretRange.startContainer, caretRange.startOffset + 1);
      } catch (e) {
        // Sometimes the range is not valid, in which case we just ignore it
      }
      const hoveredText = newRange.toString();

      if (hoveredText === lastText.current) {
        return;
      }

      lastText.current = hoveredText;

      const foundHanzi = (hanzi as any)[hoveredText];

      if (foundHanzi) {
        setRect(newRange.getBoundingClientRect());
        setHanziValue(foundHanzi);
      } else {
        setRect(null);
        setHanziValue(null);
      }
    };

    const onScroll = () => {
      setRect(null);
      setHanziValue(null);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onMouseMove);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  });

  if (!rect || !hanziValue) {
    return null;
  }

  const goUp = rect.bottom > window.innerHeight - 200;

  return (
    <>
      <WBPopup
        x={rect.left}
        y={goUp ? rect.top : rect.bottom}
        direction={goUp ? "top right" : "bottom right"}
      >
        <S.FakeHighlight rect={rect} />
        <S.Wrapper>
          <p>{hanziValue.character}</p>
          <p>{hanziValue.pinyin.join(", ")}</p>
          <p>{hanziValue.definition}</p>
          <p>{JSON.stringify(hanziValue.etymology, null, 10)}</p>
        </S.Wrapper>
      </WBPopup>
    </>
  );
};

export default ChinesePopup;
