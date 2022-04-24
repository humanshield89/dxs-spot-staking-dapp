import {
  createTheme as createMuiTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import { baseThemeOptions } from "./base-theme-options";
import { darkThemeOptions } from "./dark-theme-options";
import { lightThemeOptions } from "./light-theme-options";
import { THEMES } from "../constants";

export const createTheme = (config) => {
  let theme = createMuiTheme(
    baseThemeOptions,
    config.theme === THEMES.DARK ? darkThemeOptions : darkThemeOptions, // TODO: change this to light theme to enable it
    {
      direction: config.direction,
    }
  );

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};
