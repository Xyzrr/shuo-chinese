import styled, { css, createGlobalStyle } from "styled-components";
import Slider from "@mui/material/Slider";
import { LEVEL_COLORS, FOREGROUND_COLOR, BACKGROUND_COLOR } from "./colors";
import { FormControlLabel } from "@mui/material";

export const GlobalStyle = createGlobalStyle`
  body {
      background: ${BACKGROUND_COLOR};
      color: #c8c8c8;
      font-family: Source Sans Pro;
  }
  * {
    box-sizing: border-box;
  }
  a {
    color: #c8c8c8;
    opacity: 0.7;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const FullPage = styled.div``;

export const Logo = styled.div`
  user-select: none;
  color: rgba(200, 200, 200, 0.3);
  font-size: 32px;
  padding-left: 20px;
  margin-bottom: 24px;
  margin-top: 0px;
  // font-weight: bold;
`;

export const EnglishWrapper = styled.div`
  padding: 32px;
  padding-left: 16px;
  text-align: left;
  width: calc(min(45vw, 1200px * 0.45) - 32px);

  @media (max-width: 768px) {
    width: 100%;
    padding-left: 8px;
    padding-right: 24px;
  }
`;

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

export const GrammarArticleWrapper = styled.div`
  overflow-wrap: break-word;
  outline: none;
  background: ${FOREGROUND_COLOR};
  padding: 32px;
  position: fixed;
  right: max(32px + (100vw - 1200px) / 2, 32px);
  top: 32px;
  width: min(55vw, 1200px * 0.55);
  height: calc(100vh - 64px);
  overflow: auto;
  border-radius: 8px;
  font-size: 18px;
  line-height: 28px;
  z-index: 2;

  @media (max-width: 768px) {
    width: 100%;
    right: auto;
    left: auto;
    top: 0;
    bottom: 0;
    height: 100%;
    border-radius: 0;
    padding-left: 24px;
    padding-right: 24px;
  }
`;

export const AppWrapper = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
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

export const StyledSlider = styled(Slider)`
  // max-width: 200px;
  filter: saturate(0);
  width: 100%;
  .MuiSlider-markLabel {
    font-family: Source Sans Pro;
  }
  margin-bottom: 28px !important;
`;

export const SettingsButton = styled.div`
  position: fixed;
  right: max(32px + (100vw - 1200px) / 2, 32px);
  top: 40px;
  color: rgba(200, 200, 200, 0.5);
  border-radius: 50%;
  background: ${BACKGROUND_COLOR}dd;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  box-sizing: border-box;
  z-index: 1;
  &:hover {
    color: rgba(200, 200, 200, 0.8);
  }
  font-size: 24px !important;
  @media (max-width: 768px) {
    right: max(24px + (100vw - 1200px) / 2, 24px);
  }
`;

export const SettingsWrapper = styled.div`
  width: 200px;
  background: ${FOREGROUND_COLOR};
  border-radius: 4px;
  padding: 16px 24px;
`;

export const CloseArticleButton = styled.div`
  position: fixed;
  top: 48px;
  right: max(48px + (100vw - 1200px) / 2, 48px);
  background: ${FOREGROUND_COLOR}dd;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 8px;
  z-index: 3;
  &:hover {
    filter: brightness(1.2);
  }
  @media (max-width: 768px) {
    top: 24px;
    right: 24px;
  }
`;

export const StyledFormControlLabel = styled(FormControlLabel)`
  filter: saturate(0);
  margin-left: -13px !important;
  .MuiTypography-root {
    font-family: Source Sans Pro;
  }
`;
