import Button from "@mui/material/Button";
import makeStyles from "@mui/styles/makeStyles";
import React from "react";

const styles = makeStyles((theme) => ({
  gradientButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    fontSize: 16,
    transition: "all 0.5s",
    textTransform: "uppercase",
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
    "&:disabled": {
      background: `linear-gradient(90deg, #2a2a2a55 0%, #2a2a2a55 100%)`,
      color: "gray!important",
    },
  },
}));

export const GradientButton = ({ children, ...rest }) => {
  const classes = styles();
  return (
    <Button {...rest} className={classes.gradientButton} size={"large"}>
      {children}
    </Button>
  );
};
