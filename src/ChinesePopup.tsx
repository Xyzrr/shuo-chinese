import * as S from "./ChinesePopup.styles";
import React from "react";
import { WBPopup } from "./WBPopup";
import hanzi from "./hanzi.json";
import { getHSKLevel } from "./hsk";
import cedict from "./cedict.json";

const etymologyToString = (etymology: any) => {
  if (etymology.type === "pictophonetic") {
    return `${etymology.semantic} (${etymology.hint}) provides the meaning while ${etymology.phonetic} provides the pronunciation.`;
  }
  return `${etymology.hint}`;
};

interface ChinesePopupProps {}

const ChinesePopup: React.FC<ChinesePopupProps> = () => {
  const [currentRange, setCurrentRange] = React.useState<Range | null>(null);

  const lastNodeRef = React.useRef<Node | null>(null);
  const lastOffsetRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const reset = () => {
      setCurrentRange(null);
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

      let hoveredCharRange: Range | null = null;

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
            hoveredCharRange = leftRange;
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
            hoveredCharRange = rightRange;
          }
        }
      }

      if (!hoveredCharRange) {
        reset();
        return;
      }

      if (
        lastNodeRef.current === hoveredCharRange.startContainer &&
        lastOffsetRef.current === hoveredCharRange.startOffset
      ) {
        if (toggle) {
          reset();
        }
        return;
      }

      lastNodeRef.current = hoveredCharRange.startContainer;
      lastOffsetRef.current = hoveredCharRange.startOffset;

      let hoveredWordRange = hoveredCharRange.cloneRange();
      for (let n = 4; n >= 1; n--) {
        try {
          const tempRange = hoveredCharRange.cloneRange();
          tempRange.setEnd(
            hoveredCharRange.endContainer,
            hoveredCharRange.endOffset + n
          );

          if ((cedict as any)[tempRange.toString()]) {
            hoveredWordRange = tempRange;
            break;
          }
        } catch (e) {
          // keep trying till it works
        }
      }

      setCurrentRange(hoveredWordRange);
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
      setCurrentRange(null);
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

  if (!currentRange) {
    return null;
  }

  const word = currentRange.toString();
  const rect = currentRange.getBoundingClientRect();

  const goUp = rect.bottom > window.innerHeight - 200;
  const hanziValue = (hanzi as any)[word[0]];

  const cedictDefs = (cedict as any)[word];

  console.log(
    "current range",
    currentRange,
    currentRange.toString(),
    cedictDefs
  );

  return (
    <>
      <WBPopup
        x={rect.left}
        y={goUp ? rect.top : rect.bottom}
        direction={goUp ? "top right" : "bottom right"}
        key={word}
      >
        <S.FakeHighlight rect={rect} />
        <S.Wrapper className="chinese-popup">
          {word.length > 1 && (
            <S.WordDef>
              <S.TopRow>
                <S.Character
                  className="secret-pleco-link"
                  href={`plecoapi://x-callback-url/s?q=${word}`}
                >
                  {word}
                </S.Character>
              </S.TopRow>
              {Object.keys(cedictDefs).map((pinyin) => {
                const def = cedictDefs[pinyin] as string[];
                return (
                  <>
                    <S.Pinyin>{pinyin}</S.Pinyin>
                    <p>
                      {def.map((d, i) => (
                        <>
                          {d}
                          {i < def.length - 1 && (
                            <S.DefSeparator> | </S.DefSeparator>
                          )}
                        </>
                      ))}
                    </p>
                  </>
                );
              })}
            </S.WordDef>
          )}
          <S.WordDef>
            <S.TopRow>
              <S.Character
                className="secret-pleco-link"
                href={`plecoapi://x-callback-url/s?q=${hanziValue.character}`}
              >
                {hanziValue.character}
              </S.Character>
              <S.HSKLevel>
                <S.HSKLevelPrefix>HSK </S.HSKLevelPrefix>
                {getHSKLevel(hanziValue.character) || "7+"}
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
          </S.WordDef>
        </S.Wrapper>
      </WBPopup>
    </>
  );
};

export default ChinesePopup;
