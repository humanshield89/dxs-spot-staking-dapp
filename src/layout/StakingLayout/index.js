import Box from "@mui/material/Box";
import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Header from "./Header";
import Container from "@mui/material/Container";

const styles = makeStyles((theme) => ({
  root: {
    padding: 0,

    display: "flex",
    flexDirection: "column",
    marginTop: "2.5rem",
    marginBottom: "2.5rem",
    marginRight: "auto",
    marginLeft: "auto",
    borderRadius: 0,
    zIndex: 5,
    [theme.breakpoints.down("lg")]: {
      maxWidth: "95%",
    },
  },
  wrapper: {
    backgroundColor: "transparent",
    display: "flex",
    width: "100%",
    minHeight: "100%",
    marginTop: 30,
    zIndex: 5,
    paddingBottom: 30,
  },
}));

const StakingLayout = ({ children }) => {
  const classes = styles();

  return (
    <Container maxWidth={"lg"} className={classes.root}>
      <Header />
      <Box className={classes.wrapper}>{children}</Box>
      <Box style={{ minHeight: 120 }} />
    </Container>
  );
};

export default StakingLayout;
