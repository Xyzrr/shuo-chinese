import * as S from "./ChinesePopup.styles";
import React from "react";
import { WBPopup } from "./WBPopup";
import hanzi from "./hanzi.json";

interface ChinesePopupProps {}

const ChinesePopup: React.FC<ChinesePopupProps> = () => {
  const [currentMatch, setCurrentMatch] = React.useState<{
    rect: DOMRect;
    text: string;
  } | null>(null);

  const lastNodeRef = React.useRef<Node | null>(null);
  const lastOffsetRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const caretRange = document.caretRangeFromPoint(e.clientX, e.clientY);
      if (!caretRange) {
        return;
      }

      let leftRange = null;
      try {
        const temp = document.createRange();
        temp.setStart(caretRange.startContainer, caretRange.startOffset - 1);
        temp.setEnd(caretRange.startContainer, caretRange.startOffset);
        leftRange = temp;
      } catch (e) {}

      let rightRange = null;
      try {
        const temp = document.createRange();
        temp.setEnd(caretRange.startContainer, caretRange.startOffset + 1);
        temp.setStart(caretRange.startContainer, caretRange.startOffset);
        rightRange = temp;
      } catch (e) {}

      let hoveredMatch: any = null;

      if (leftRange) {
        const leftText = leftRange.toString();
        const foundHanzi = (hanzi as any)[leftText];
        if (foundHanzi) {
          const leftRect = leftRange.getBoundingClientRect();
          if (e.clientX <= leftRect.right) {
            hoveredMatch = {
              text: leftText,
              rect: leftRect,
              node: leftRange.startContainer,
              offset: leftRange.startOffset,
            };
          }
        }
      }
      if (rightRange) {
        const rightText = rightRange.toString();
        const foundHanzi = (hanzi as any)[rightText];
        if (foundHanzi) {
          const rightRect = rightRange.getBoundingClientRect();
          if (e.clientX > rightRect.left) {
            hoveredMatch = {
              text: rightText,
              rect: rightRect,
              node: rightRange.startContainer,
              offset: rightRange.startOffset,
            };
          }
        }
      }

      if (!hoveredMatch) {
        setCurrentMatch(null);
        lastNodeRef.current = null;
        lastOffsetRef.current = null;
        return;
      }

      if (
        lastNodeRef.current === hoveredMatch.node &&
        lastOffsetRef.current === hoveredMatch.offset
      ) {
        return;
      }

      lastNodeRef.current = hoveredMatch.node;
      lastOffsetRef.current = hoveredMatch.offset;

      setCurrentMatch({ text: hoveredMatch.text, rect: hoveredMatch.rect });
    };

    const onScroll = () => {
      setCurrentMatch(null);
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

  if (!currentMatch) {
    return null;
  }

  const goUp = currentMatch.rect.bottom > window.innerHeight - 200;
  const hanziValue = (hanzi as any)[currentMatch.text];

  return (
    <>
      <WBPopup
        x={currentMatch.rect.left}
        y={goUp ? currentMatch.rect.top : currentMatch.rect.bottom}
        direction={goUp ? "top right" : "bottom right"}
      >
        <S.FakeHighlight rect={currentMatch.rect} />
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
