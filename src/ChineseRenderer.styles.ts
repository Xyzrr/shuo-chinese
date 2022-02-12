import styled, { css } from "styled-components";

export const Wrapper = styled.div<{ specialType?: string }>`
  strong {
    color: rgb(150, 250, 130);
  }
  ${(props) =>
    props.specialType === "incorrect" &&
    css`
      strong {
        color: rgb(235, 59, 46);
      }
    `}
`;

export const WordWrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
`;

export const Pinyin = styled.div`
  line-height: normal;
  text-align: center;
  font-size: 14px;
  color: #bbb;
  user-select: none;
`;

export const EmphasisChars = styled.div`
  font-size: 28px;
  line-height: normal;
  background: rgba(255, 255, 0, 0.1);
  color: #ddd;
`;

export const StrongChars = styled.strong`
  font-weight: normal;
  font-size: 28px;
  line-height: normal;
`;

export const Chars = styled.div`
  font-size: 28px;
  line-height: normal;
`;

export const English = styled.div`
  font-size: 14px;
  color: #bbb;
  line-height: normal;
`;
