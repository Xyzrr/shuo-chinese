import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 8px;
  background: #323232;
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
  background: rgba(255, 255, 255, 0.15);
`;
