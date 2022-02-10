import styled from "styled-components";

export const Child = styled.div`
  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

export const Prefix = styled.span`
  opacity: 0.6;
  display: inline-block;
  width: 24px;
`;
