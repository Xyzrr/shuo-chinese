import styled, { createGlobalStyle } from "styled-components";
import Slider from "@mui/material/Slider";
import { LEVEL_COLORS, FOREGROUND_COLOR, BACKGROUND_COLOR } from "./colors";
import { FormControlLabel } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export const GlobalStyle = createGlobalStyle`
  body {
      background: ${BACKGROUND_COLOR};
      color: #c8c8c8;
      font-family: Source Sans Pro;
  }
  * {
    box-sizing: border-box;
  }
  a {
    color: #c8c8c8;
    opacity: 0.7;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const FullPage = styled.div``;

export const Logo = styled.div`
  user-select: none;
  color: rgba(200, 200, 200, 0.3);
  font-size: 32px;
  padding-left: 20px;
  margin-bottom: 24px;
  margin-top: 32px;
  // font-weight: bold;
`;

export const GrammarArticleWrapper = styled.div`
  overflow-wrap: break-word;
  outline: none;
  background: ${FOREGROUND_COLOR};
  padding: 32px;
  position: fixed;
  right: max(32px + (100vw - 1200px) / 2, 32px);
  top: 32px;
  width: min(55vw, 1200px * 0.55);
  height: calc(100vh - 64px);
  overflow: auto;
  border-radius: 8px;
  font-size: 18px;
  line-height: 28px;
  z-index: 2;

  @media (max-width: 768px) {
    width: 100%;
    right: auto;
    left: auto;
    top: 0;
    bottom: 0;
    height: 100%;
    border-radius: 0;
    padding-left: 24px;
    padding-right: 24px;
  }
`;

export const AppWrapper = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

export const EnglishWrapper = styled.div`
  padding-bottom: 128px;
  padding-right: 32px;
  padding-left: 16px;
  text-align: left;
  width: calc(min(45vw, 1200px * 0.45) - 32px);

  @media (max-width: 768px) {
    width: 100%;
    padding-left: 8px;
    padding-right: 24px;
  }
`;

export const StyledSlider = styled(Slider)`
  // max-width: 200px;
  filter: saturate(0);
  width: 100%;
  .MuiSlider-markLabel {
    font-family: Source Sans Pro;
  }
  margin-bottom: 28px !important;
`;

export const SettingsButton = styled.div`
  position: fixed;
  right: max(32px + (100vw - 1200px) / 2, 32px);
  top: 40px;
  color: rgba(200, 200, 200, 0.5);
  border-radius: 50%;
  background: ${BACKGROUND_COLOR}dd;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  box-sizing: border-box;
  z-index: 1;
  &:hover {
    color: rgba(200, 200, 200, 0.8);
  }
  font-size: 24px !important;
  @media (max-width: 768px) {
    right: max(24px + (100vw - 1200px) / 2, 24px);
  }
`;

export const SettingsWrapper = styled.div`
  width: 200px;
  background: ${FOREGROUND_COLOR};
  border-radius: 4px;
  padding: 16px 24px;
`;

export const CloseArticleButton = styled.div`
  color: #888;
  position: fixed;
  top: 48px;
  right: max(48px + (100vw - 1200px) / 2, 48px);
  background: ${FOREGROUND_COLOR}dd;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 8px;
  z-index: 3;
  &:hover {
    filter: brightness(1.2);
  }
  @media (max-width: 768px) {
    top: 16px;
    right: 16px;
  }
`;

export const StyledFormControlLabel = styled(FormControlLabel)`
  filter: saturate(0);
  margin-left: -13px !important;
  .MuiTypography-root {
    font-family: Source Sans Pro;
  }
`;

export const SearchWrapper = styled.div`
  background: ${BACKGROUND_COLOR};
  position: sticky;
  z-index: 1;
  display: flex;
  align-items: center;
  top: 0;
  padding-left: 12px;
  padding-top: 40px;
  padding-bottom: 16px;
  margin-bottom: 15px;
`;

export const StyledSearchIcon = styled(SearchIcon)`
  position: absolute;
  left: 16px;
  font-size: 14px;
  opacity: 0.5;
  transform: scale(0.8);
`;

export const SearchInput = styled.input`
  background: none;
  border: none;
  outline: none;
  background: ${FOREGROUND_COLOR};
  color: #c8c8c8;
  font-size: 18px;
  border-radius: 4px;
  padding: 4px 8px;
  padding-left: 32px;
  font-family: Source Sans Pro;
  height: 30px;
`;

export const OtherResultsLabel = styled.div`
  color: #999;
  margin-left: 20px;
  margin-top: 32px;
`;
