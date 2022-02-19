import styled, { css } from "styled-components";
import XIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";

export const Wrapper = styled.div<{ specialType?: string }>`
  display: flex;
  align-items: center;
  ${(props) =>
    props.specialType === "correction" &&
    css`
      strong {
        color: rgb(150, 250, 130);
      }
    `}
  ${(props) =>
    props.specialType === "incorrect" &&
    css`
      strong {
        color: rgb(235, 59, 46);
      }
    `}
`;

export const InnerWrapper = styled.div``;

export const WordWrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
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
  color: #91b7ff;
`;

export const StrongChars = styled.strong`
  font-weight: normal;
  font-size: 28px;
  line-height: normal;
  color: #e0a375;
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

export const StyledCheckIcon = styled(CheckIcon)`
  color: rgb(150, 250, 130);
  margin-right: 8px;
`;

export const StyledXIcon = styled(XIcon)`
  color: rgb(235, 59, 46);
  margin-right: 8px;
`;
