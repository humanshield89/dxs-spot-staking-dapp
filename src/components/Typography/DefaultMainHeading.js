import React from "react";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";

const styles = makeStyles((theme) => ({
  heading: {
    width: "100%",
    textAlign: "center",
    fontWeight: 700,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    "-webkit-background-clip": "text",
    "-webkit-text-fill-color": "transparent",
  },
}));

const DefaultMainHeading = ({ variant, children, ...rest }) => {
  const classes = styles();

  return (
    <Typography
      variant={variant ? variant : "h2"}
      className={classes.heading}
      {...rest}
    >
      {children}
    </Typography>
  );
};

export default DefaultMainHeading;
