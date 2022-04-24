import { createStyles } from "@mui/material";
import { makeStyles } from "@mui/styles";

// Add global styles here
const useStyles = makeStyles((theme) =>
  createStyles({
    "@global": {
      "*": {
        boxSizing: "border-box",
        margin: 0,
        padding: 0,
      },
      html: {
        "-webkit-font-smoothing": "antialiased",
        "-moz-osx-font-smoothing": "grayscale",
        height: "100%",
        width: "100%",
      },
      body: {
        height: "100%",
        width: "100%",
        //backgroundColor: theme.palette.background.default,
        backgroundImage: 'url("images/bg2.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      },
      "#root": {
        height: "100%",
        width: "100%",
      },
      ".gradient-text": {
        background: `linear-gradient(270deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        "-webkit-background-clip": "text",
        "-webkit-text-fill-color": "transparent",
        "background-clip": "text",
        "text-fill-color": "transparent",
      },
    },
  })
);

const GlobalStyles = () => {
  useStyles();
  return null;
};

export default GlobalStyles;
