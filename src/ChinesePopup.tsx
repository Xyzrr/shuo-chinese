import React from "react";
import { WBPopup } from "./WBPopup";

interface ChinesePopupProps {}

const ChinesePopup: React.FC<ChinesePopupProps> = ({}) => {
  const [rect, setRect] = React.useState<DOMRect | null>(null);

  const lastNode = React.useRef<Node | null>(null);
  const lastOffset = React.useRef<number | null>(null);

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const caretRange = document.caretRangeFromPoint(e.pageX, e.pageY);
      if (
        caretRange &&
        (lastNode.current !== caretRange.startContainer ||
          lastOffset.current !== caretRange.startOffset)
      ) {
        lastNode.current = caretRange.startContainer;
        lastOffset.current = caretRange.startOffset;

        const sel = window.getSelection();
        const newRange = document.createRange();
        newRange.setStart(caretRange.startContainer, caretRange.startOffset);
        newRange.setEnd(caretRange.startContainer, caretRange.startOffset + 1);
        sel?.empty();
        sel?.addRange(newRange);
        setRect(caretRange.getBoundingClientRect());
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  });

  if (!rect) {
    return null;
  }

  return (
    <>
      <WBPopup x={rect.left} y={rect.bottom} direction="bottom right">
        Hey there!
      </WBPopup>
    </>
  );
};

export default ChinesePopup;
