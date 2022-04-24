// Colors

const neutral = {
  50: "#f7f7f7",
  100: "#ededed",
  200: "#e1e1e1",
  300: "#cecece",
  400: "#a9a9a9",
  500: "#888888",
  600: "#616161",
  700: "#4e4e4e",
  800: "#303030",
  900: "#202020",
};

const background = {
  default: neutral[100] + "cc",
  paper: "#ffffff" + "cc",
};

const divider = neutral[200];

const hover = neutral[200];

const primary = {
  main: "#00AA13",
  dark: "#00AA13",
  light: "#00AA13",
  contrastText: neutral[900],
};

const secondary = {
  main: "#54d0f7",
  dark: "#54d0f7",
  light: "#54d0f7",
  contrastText: neutral[900],
};

const success = {
  main: "#14B8A6",
  light: "#43C6B7",
  dark: "#0E8074",
  contrastText: "#FFFFFF",
};

const info = {
  main: "#2196F3",
  light: "#64B6F7",
  dark: "#0B79D0",
  contrastText: "#FFFFFF",
};

const warning = {
  main: "#FFB020",
  light: "#FFBF4C",
  dark: "#B27B16",
  contrastText: "#FFFFFF",
};

const error = {
  main: "#D14343",
  light: "#DA6868",
  dark: "#922E2E",
  contrastText: "#FFFFFF",
};

const text = {
  main: "#121828",
  primary: "#121828",
  secondary: "#65748B",
  disabled: "rgba(55, 65, 81, 0.48)",
  contrastText: "#F9FAFC",
  subtitleStart: "#333",
  subtitleEnd: "#bbb",
};

export const lightThemeOptions = {
  components: {
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: neutral[500],
          color: "#FFFFFF",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          "&.MuiChip-filledDefault": {
            backgroundColor: neutral[200],
            "& .MuiChip-deleteIcon": {
              color: neutral[400],
            },
          },
          "&.MuiChip-outlinedDefault": {
            "& .MuiChip-deleteIcon": {
              color: neutral[300],
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "&::placeholder": {
            opacity: 1,
            color: text.secondary,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: divider,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderColor: divider,
          borderStyle: "solid",
          borderWidth: 1,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderColor: divider,
          borderStyle: "solid",
          borderWidth: 1,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: neutral[500],
        },
        track: {
          backgroundColor: neutral[400],
          opacity: 1,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${divider}`,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: neutral[100],
          ".MuiTableCell-root": {
            color: neutral[700],
          },
        },
      },
    },
  },
  palette: {
    action: {
      active: neutral[500],
      focus: "rgba(55, 65, 81, 0.12)",
      hover: "rgba(55, 65, 81, 0.04)",
      selected: "rgba(55, 65, 81, 0.08)",
      disabledBackground: "rgba(55, 65, 81, 0.12)",
      disabled: "rgba(55, 65, 81, 0.26)",
    },
    background,
    divider,
    hover,
    error,
    info,
    mode: "light",
    neutral,
    primary,
    secondary,
    success,
    text,
    warning,
  },
  shadows: [
    "none",
    "0px 1px 1px rgba(100, 116, 139, 0.06), 0px 1px 2px rgba(100, 116, 139, 0.1)",
    "0px 1px 2px rgba(100, 116, 139, 0.25)",
    "0px 1px 4px rgba(100, 116, 139, 0.25)",
    "0px 1px 5px rgba(100, 116, 139, 0.25)",
    "0px 1px 6px rgba(100, 116, 139, 0.25)",
    "0px 2px 6px rgba(100, 116, 139, 0.25)",
    "0px 3px 6px rgba(100, 116, 139, 0.25)",
    "0px 2px 4px rgba(31, 41, 55, 0.25), 0px 4px 6px rgba(100, 116, 139, 0.12)",
    "0px 5px 12px rgba(100, 116, 139, 0.25)",
    "0px 5px 14px rgba(100, 116, 139, 0.25)",
    "0px 5px 15px rgba(100, 116, 139, 0.25)",
    "0px 6px 15px rgba(100, 116, 139, 0.25)",
    "0px 7px 15px rgba(100, 116, 139, 0.25)",
    "0px 8px 15px rgba(100, 116, 139, 0.25)",
    "0px 9px 15px rgba(100, 116, 139, 0.25)",
    "0px 10px 15px rgba(100, 116, 139, 0.25)",
    "0px 12px 22px -8px rgba(100, 116, 139, 0.25)",
    "0px 13px 22px -8px rgba(100, 116, 139, 0.25)",
    "0px 14px 24px -8px rgba(100, 116, 139, 0.25)",
    "0px 10px 10px rgba(31, 41, 55, 0.25), 0px 20px 25px rgba(31, 41, 55, 0.25)",
    "0px 25px 50px rgba(100, 116, 139, 0.25)",
    "0px 25px 50px rgba(100, 116, 139, 0.25)",
    "0px 25px 50px rgba(100, 116, 139, 0.25)",
    "0px 25px 50px rgba(100, 116, 139, 0.25)",
  ],
};
