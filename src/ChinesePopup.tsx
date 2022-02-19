import * as S from "./ChinesePopup.styles";
import React from "react";
import { WBPopup } from "./WBPopup";
import hanzi from "./hanzi.json";
import { getHSKLevel } from "./hsk";

const etymologyToString = (etymology: any) => {
  if (etymology.type === "pictophonetic") {
    return `${etymology.semantic} (${etymology.hint}) provides the meaning while ${etymology.phonetic} provides the pronunciation.`;
  }
  return `${etymology.hint}`;
};

interface ChinesePopupProps {}

const ChinesePopup: React.FC<ChinesePopupProps> = () => {
  const [currentMatch, setCurrentMatch] = React.useState<{
    rect: DOMRect;
    text: string;
  } | null>(null);

  const lastNodeRef = React.useRef<Node | null>(null);
  const lastOffsetRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const reset = () => {
      setCurrentMatch(null);
      lastNodeRef.current = null;
      lastOffsetRef.current = null;
    };

    const findMatchFromPoint = (x: number, y: number, toggle = false) => {
      const caretRange = document.caretRangeFromPoint(x, y);
      if (!caretRange) {
        reset();
        return;
      }

      const elementAtPoint = document.elementFromPoint(x, y);

      if (elementAtPoint?.classList.contains("secret-pleco-link")) {
        return;
      }

      if (elementAtPoint?.closest(".no-popup")) {
        reset();
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
          if (
            x >= leftRect.left &&
            x <= leftRect.right &&
            y >= leftRect.top &&
            y <= leftRect.bottom
          ) {
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
          if (
            x > rightRect.left &&
            x <= rightRect.right &&
            y >= rightRect.top &&
            y <= rightRect.bottom
          ) {
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
        reset();
        return;
      }

      if (
        lastNodeRef.current === hoveredMatch.node &&
        lastOffsetRef.current === hoveredMatch.offset
      ) {
        if (toggle) {
          reset();
        }
        return;
      }

      lastNodeRef.current = hoveredMatch.node;
      lastOffsetRef.current = hoveredMatch.offset;

      setCurrentMatch({ text: hoveredMatch.text, rect: hoveredMatch.rect });
    };

    const onMouseMove = (e: MouseEvent) => {
      findMatchFromPoint(e.clientX, e.clientY);
    };

    const onTouchEnd = (e: TouchEvent) => {
      findMatchFromPoint(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY,
        true
      );
    };

    const onScroll = () => {
      setCurrentMatch(null);
    };

    const canHover = window.matchMedia("(hover: hover)").matches;
    if (canHover) {
      window.addEventListener("mousemove", onMouseMove);
    } else {
      window.addEventListener("touchend", onTouchEnd);
    }
    window.addEventListener("scroll", onScroll);
    return () => {
      if (canHover) {
        window.removeEventListener("mousemove", onMouseMove);
      } else {
        window.removeEventListener("touchend", onTouchEnd);
      }
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
        key={currentMatch.text}
      >
        <S.FakeHighlight rect={currentMatch.rect} />
        <S.Wrapper className="chinese-popup">
          <S.TopRow>
            <S.Character
              className="secret-pleco-link"
              href={`plecoapi://x-callback-url/s?q=${hanziValue.character}`}
            >
              {hanziValue.character}
            </S.Character>
            <S.HSKLevel>
              <S.HSKLevelPrefix>HSK </S.HSKLevelPrefix>
              {getHSKLevel(hanziValue.character)}
            </S.HSKLevel>
          </S.TopRow>
          <S.Pinyin>{hanziValue.pinyin.join(", ")}</S.Pinyin>
          <p>{hanziValue.definition}</p>
          {hanziValue.etymology && (
            <p>
              <S.EtymologyType>{hanziValue.etymology.type}: </S.EtymologyType>
              {etymologyToString(hanziValue.etymology)}
            </p>
          )}
        </S.Wrapper>
      </WBPopup>
    </>
  );
};

export default ChinesePopup;
