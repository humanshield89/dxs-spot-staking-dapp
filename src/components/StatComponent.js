import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import makeStyles from "@mui/styles/makeStyles";
import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/system";
import CircularProgress from "@mui/material/CircularProgress";

const styles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: 700,
    fontSize: 18,
    color: "gray",
    background: `-webkit-linear-gradient(${theme.palette.text.secondary}, ${theme.palette.text.secondary})`,
    "-webkit-background-clip": "text",
    "-webkit-text-fill-color": "transparent",
  },
  spacer: {
    minHeight: 2,
  },
  value: {
    color: theme.palette.secondary.main,
  },
}));

export const StatComponent = ({ title, value, subtitle, lastRow, ...rest }) => {
  const theme = useTheme();
  const classes = styles();
  return (
    <Box className={classes.root} {...rest}>
      <Typography
        variant={"subtitle1"}
        component={"h2"}
        className={classes.title}
      >
        {title}
      </Typography>
      <Box className={classes.spacer} />
      <Typography variant={"h4"} component={"span"} className={classes.value}>
        {value ? value : <CircularProgress color={"secondary"} size={24} />}
      </Typography>
      {subtitle && (
        <Typography
          variant={"subtitle2"}
          component={"span"}
          className={classes.title}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default StatComponent;
