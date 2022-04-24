import Page from "../../components/Page";
import React from "react";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { PricesProvider } from "../../contexts/PricesContext";
import { testNetFarms } from "../../Web3Utils/farmConfigs";
import { FarmsProvider } from "../../contexts/FarmsContext";
import FarmsList from "../../components/Farms/FarmList";

const styles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
  },
}));

const Farms = () => {
  const classes = styles();

  return (
    <Page title={"Staking Pools"} className={classes.root}>
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Grid item xs={12}>
          <PricesProvider farmConfig={testNetFarms}>
            <FarmsProvider farmConfig={testNetFarms}>
              <FarmsList />
            </FarmsProvider>
          </PricesProvider>
        </Grid>
      </Grid>
      <Box style={{ minHeight: 30 }} />
    </Page>
  );
};

export default Farms;
