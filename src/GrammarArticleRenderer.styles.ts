import styled from "styled-components";
import { CODE_BLOCK_COLOR } from "./colors";
import { LEVEL_COLORS } from "./colors";

export const OriginalLink = styled.div`
  color: #c8c8c8;
  opacity: 0.6;
  a {
    opacity: 1;
  }
`;

export const H1 = styled.h1`
  font-size: 40px;
  // margin-top: 32px;
  margin-top: 0;
  margin-bottom: 16px;
  line-height: normal;
`;

export const H2 = styled.h2`
  font-size: 28px;
  margin-top: 32px;
  margin-bottom: 8px;
  line-height: normal;
`;

export const H3 = styled.h3`
  font-size: 20px;
  margin-bottom: 8px;
  line-height: normal;
`;

export const H4 = styled.h4`
  font-size: 18px;
  line-height: normal;
`;

export const Table = styled.table`
  text-align: left;
  border-collapse: collapse;
  margin-left: -2px;
  margin-right: -2px;
  tbody {
    vertical-align: baseline;
  }
  th,
  td {
    border: 1px solid #555;
    padding: 2px 4px;
  }
`;

export const ExampleSet = styled.div`
  padding: 8px 12px;
  margin: 0 -2px 8px;
  border: 1px solid #444;
  border-radius: 4px;
  background: ${CODE_BLOCK_COLOR};
`;

export const Structure = styled.div`
  padding: 8px 12px;
  margin: 0 10px 8px -2px;
  border: 1px solid #444;
  border-radius: 4px;
  background: ${CODE_BLOCK_COLOR};
  display: inline-block;
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-top: -10px;
  margin-bottom: 32px;
`;

export const ArticleLevel = styled.div<{ level: number }>`
  display: flex;
  align-items: center;
  background: ${(props) => LEVEL_COLORS[props.level]};
  display: inline-block;
  padding: 0 6px;
  border-radius: 2px;
  color: #2a282f;
  line-height: normal;
  margin-right: 8px;
  margin-left: 2px;
`;

export const DesktopOnly = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;
