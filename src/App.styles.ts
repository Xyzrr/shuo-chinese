import styled, { css, createGlobalStyle } from "styled-components";
import Slider from "@mui/material/Slider";
import SettingsIcon from "@mui/icons-material/Settings";

export const GlobalStyle = createGlobalStyle`
  body {
      background: #252525;
      color: #c8c8c8;
      font-family: Source Sans Pro;
  }
  * {
    box-sizing: border-box;
  }
  a {
    color: #989898;
    &:hover {
      color: #a8a8a8;
    }
  }
`;

export const FullPage = styled.div``;

export const EnglishWrapper = styled.div`
  padding: 32px;
  padding-left: 16px;
  text-align: left;
  width: calc(min(45vw, 1200px * 0.45) - 32px);
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
  &:hover {
    ${EnglishItemInner} {
      background: rgba(255, 255, 255, 0.03);
    }
  }
  border-left: 1px solid transparent;

  ${(props) =>
    props.active &&
    (props.reveal === "none"
      ? css`
          border-left: 1px solid #555;
        `
      : css`
          ${EnglishItemInner} {
            background: #323232 !important;
          }
        `)}
`;

export const GrammarArticleWrapper = styled.div`
  outline: none;
  background: #323232;
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
  .MuiSvgIcon-root {
    opacity: 0.6;
    margin-right: 4px;
  }
`;

export const StyledSlider = styled(Slider)`
  // max-width: 200px;
  filter: saturate(0);
  width: 100%;
  .MuiSlider-markLabel {
    font-family: Source Sans Pro;
  }
`;

export const SettingsButton = styled(SettingsIcon)`
  position: fixed;
  right: max(32px + (100vw - 1200px) / 2, 32px);
  top: 40px;
  opacity: 0.3;
  &:hover {
    opacity: 0.6;
  }
`;

export const SettingsWrapper = styled.div`
  width: 200px;
  background: #323232;
  border-radius: 4px;
  padding: 16px 24px;
`;
