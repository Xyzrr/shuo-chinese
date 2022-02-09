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
  text-align: right;
  width: calc(45vw - 32px);
`;

export const EnglishItemInner = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
`;

export const EnglishItem = styled.div<{ active?: boolean }>`
  font-size: 18px;
  padding: 8px;
  ${(props) =>
    props.active &&
    css`
      ${EnglishItemInner} {
        background: rgba(255, 255, 255, 0.1);
      }
    `}
`;

export const GrammarArticleWrapper = styled.div`
  background: #323232;
  padding: 32px;
  position: fixed;
  right: 32px;
  top: 32px;
  width: 55vw;
  height: calc(100vh - 64px);
  overflow: auto;
  border-radius: 8px;
`;

export const AppWrapper = styled.div`
  display: flex;
`;
