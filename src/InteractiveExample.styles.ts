import styled, { css } from "styled-components";
import { LEVEL_COLORS, FOREGROUND_COLOR, BACKGROUND_COLOR } from "./colors";

export const EnglishItemInner = styled.div`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
`;

export const EnglishItem = styled.div<{
  active?: boolean;
  reveal: "none" | "answer" | "article";
}>`
  position: relative;
  font-size: 18px;
  padding: 4px;
  padding-left: 12px;
  margin: 8px 0;
  cursor: default;
  border-left: 1px solid transparent;

  @media (hover: hover) {
    &:hover {
      ${EnglishItemInner} {
        background: rgba(255, 255, 255, 0.03);
      }
    }
  }

  @media (hover: none) {
    &:active {
      ${EnglishItemInner} {
        background: rgba(255, 255, 255, 0.03);
      }
    }
  }

  ${(props) =>
    props.active &&
    (props.reveal === "none"
      ? css`
          border-left: 1px solid #555;
        `
      : css`
          ${EnglishItemInner} {
            background: ${FOREGROUND_COLOR} !important;
          }
        `)}
`;

export const AnswerWrapper = styled.div`
  position: absolute;
  right: -45vw;
  width: 45vw;
  top: -16px;
  transform: translateX(32px);
  text-align: left;
  cursor: auto;
  padding-left: 16px;
  border-left: 1px solid #555;

  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    top: auto;
    right: auto;
    border-left: none;
    background: ${FOREGROUND_COLOR};
    z-index: 1;
    width: 100%;
    transform: none;
    padding: 16px 24px;
  }
`;

export const ShowArticleButton = styled.div`
  display: inline-block;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  margin-top: 4px;
  border-radius: 4px;
  cursor: default;
  display: inline-flex;
  align-items: center;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const ArticleLevelIndicator = styled.div<{ level: number }>`
  width: 6px;
  height: 6px;
  background: ${(props) => LEVEL_COLORS[props.level]};
  border-radius: 50%;
  margin-right: 8px;
`;
