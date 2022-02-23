import styled from "styled-components";
import { FOREGROUND_COLOR } from "./colors";

export const Wrapper = styled.div`
  max-width: 300px;
  background: ${FOREGROUND_COLOR};
  border: 1px solid #555;
  border-radius: 4px;
  p {
    margin: 0;
  }
`;

export const FakeHighlight = styled.div<{ rect: DOMRect }>`
  position: fixed;
  pointer-events: none;
  z-index: 10;
  top: ${(props) => props.rect.top}px;
  left: ${(props) => props.rect.left}px;
  width: ${(props) => props.rect.width}px;
  height: ${(props) => props.rect.height}px;
  background: rgba(255, 255, 255, 0.08);
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Character = styled.a`
  font-size: 20px;
  opacity: 1;
  text-decoration: none;
`;

export const HSKLevelPrefix = styled.span`
  opacity: 0.7;
`;
export const HSKLevel = styled.div``;

export const Pinyin = styled.div`
  opacity: 0.7;
`;

export const EtymologyType = styled.span`
  opacity: 0.7;
`;

export const WordDef = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid #555;
  }
  padding: 8px;
`;

export const DefSeparator = styled.span`
  opacity: 0.7;
`;
