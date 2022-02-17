import styled from "styled-components";
import { CODE_BLOCK_COLOR } from "./colors";

export const OriginalLink = styled.div`
  color: #999;
  opacity: 0.7;
  margin-top: 24px;
  font-size: 16px;
`;

export const H1 = styled.h1`
  margin-top: 0;
  font-size: 36px;
  line-height: normal;
`;

export const H2 = styled.h2`
  font-size: 24px;
  margin-top: 32px;
  line-height: normal;
`;

export const H3 = styled.h3`
  font-size: 20px;
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
  margin: 0 -2px;
  border: 1px solid #444;
  border-radius: 4px;
  background: ${CODE_BLOCK_COLOR};
  display: inline-block;
`;
