import styled, { css, createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
      background: #060606;
      color: #c8c8c8;
      font-family: Open Sans;
  }
`;

export const EnglishWrapper = styled.div`
  padding: 32px;
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
  position: fixed;
  right: 0;
  width: 60vw;
  height: 100vh;
  overflow: auto;
`;

export const AppWrapper = styled.div`
  display: flex;
`;
