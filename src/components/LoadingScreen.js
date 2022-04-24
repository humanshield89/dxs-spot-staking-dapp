import React, { useEffect } from "react";
import NProgress from "nprogress";
import { makeStyles } from "@mui/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    backgroundColor: theme.palette.background.default,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    minHeight: "100%",
    padding: theme.spacing(3),
  },
  rootTransparent: {
    alignItems: "center",
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    minHeight: "100%",
    padding: theme.spacing(3),
  },
  progress: {
    marginBottom: "2em",
  },
}));

const LoadingScreen = ({ transparent = true }) => {
  const classes = useStyles();

  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <div className={transparent ? classes.rootTransparent : classes.root}>
      <CircularProgress className={classes.progress} />
      <Typography variant={"h1"} color={"primary"}>
        Loading
      </Typography>
    </div>
  );
};

export default LoadingScreen;
