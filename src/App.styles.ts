import styled, { css } from "styled-components";

export const EnglishWrapper = styled.div`
  padding: 16px;
`;

export const EnglishItem = styled.div<{ active?: boolean }>`
  font-size: 20px;
  padding: 8px;

  ${(props) =>
    props.active &&
    css`
      background: rgba(180, 180, 180, 1);
    `}
`;
