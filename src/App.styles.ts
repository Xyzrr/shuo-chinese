import styled, { css, createGlobalStyle } from "styled-components";

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

export const EnglishWrapper = styled.div`
  padding: 32px;
  padding-left: calc(55vw + 64px);
`;

export const EnglishItemInner = styled.div`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
`;

export const EnglishItem = styled.div<{ active?: boolean }>`
  position: relative;
  font-size: 18px;
  padding: 4px 0;
  cursor: default;
  &:hover {
    ${EnglishItemInner} {
      background: rgba(255, 255, 255, 0.03);
    }
  }
  ${(props) =>
    props.active &&
    css`
      ${EnglishItemInner} {
        background: #323232 !important;
      }
    `}
`;

export const GrammarArticleWrapper = styled.div`
  background: #323232;
  padding: 32px;
  position: fixed;
  left: 32px;
  top: 32px;
  width: 55vw;
  height: calc(100vh - 64px);
  overflow: auto;
  border-radius: 8px;
`;

export const AppWrapper = styled.div`
  display: flex;
`;

export const AnswerWrapper = styled.div`
  position: absolute;
  left: -45vw;
  width: 45vw;
  top: -22px;
  transform: translateX(-32px);
  text-align: right;
  cursor: auto;
`;

export const ShowArticleButton = styled.div`
  display: inline-block;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 4px;
  border-radius: 4px;
  cursor: default;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;
