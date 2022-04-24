import Farm from "../../components/Farms/Farm";
import useFarms from "../../hooks/useFarms";
import { SingleFarmProvider } from "../../contexts/SingleFarmContext";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import DefaultMainHeading from "../Typography/DefaultMainHeading";
import FarmsHeader from "./FarmsHeader";

const styles = makeStyles((theme) => ({}));

const FarmsList = ({ value }) => {
  const classes = styles();
  const [farmObjects, setFarmObjects] = useState([]);
  const [sortFunction, setSortFunction] = useState("default");

  const { farmConfig, globalFarmStats, isInitGlobalStatsLoaded, farms, tvl } =
    useFarms();
  const [sorted, setsorted] = useState(farmConfig.farms);

  useEffect(() => {
    setsorted([...farms]);
  }, [farms, farmConfig]);

  useEffect(() => {
    console.log(JSON.stringify(globalFarmStats));
  }, [farms, globalFarmStats]);

  useEffect(() => {
    setFarmObjects(
      farmConfig.farms.map((farm) => {
        return (
          <SingleFarmProvider pid={farm.pid} key={farm.name}>
            <Farm expandable />
          </SingleFarmProvider>
        );
      })
    );
  }, [farmConfig, farms]);

  return (
    <>
      <FarmsHeader />
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        style={{ marginBottom: 16, marginTop: 16 }}
      >
        {isInitGlobalStatsLoaded && globalFarmStats.paused && (
          <Alert
            severity={"warning"}
            style={{ display: "flex", justifyContent: "center" }}
          >
            Farms have been paused by admin, All funds are secure and all users
            will be able to interact with the farm once resumed{" "}
            {/*, users also can use the emergency withdraw but that will forfeit
            their rewards, we suggest waiting for the problem to be fixed*/}
          </Alert>
        )}
        {isInitGlobalStatsLoaded && globalFarmStats.inEmergency && (
          <Alert
            severity={"error"}
            style={{ display: "flex", justifyContent: "center" }}
          >
            Farm is in Emergency mode, users can use the emergency withdraw but
            that will forfeit their rewards, we suggest waiting for the problem
            to be fixed
          </Alert>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} style={{ marginBottom: 16 }}>
        {isInitGlobalStatsLoaded && !globalFarmStats.hasStarted && (
          <Alert
            style={{ display: "flex", justifyContent: "center" }}
            severity={"success"}
          >
            Not Active Yet!{" "}
            {globalFarmStats.startTime
              ? "Staking Pools will start on " +
                new Date(globalFarmStats.startTime * 1000).toLocaleString()
              : "No Start Date is set"}
          </Alert>
        )}

        {isInitGlobalStatsLoaded &&
          !globalFarmStats.active &&
          globalFarmStats.hasStarted && (
            <Alert
              severity={"warning"}
              style={{ display: "flex", justifyContent: "center" }}
            >
              Farms have expired deposits have been disabled
            </Alert>
          )}
      </Grid>
      {sorted.map((farm, index) => {
        return farmObjects[farm.pid];
      })}
      {sorted.length === 0 && (
        <Grid item xs={12} sm={12} md={12} lg={12} style={{ marginBottom: 16 }}>
          {globalFarmStats.hasStarted && (
            <Alert severity={"warning"}>Nothing to show here</Alert>
          )}
          <div style={{ minHeight: "100vh" }} />
        </Grid>
      )}
    </>
  );
};

export default FarmsList;

function formatMoneyNumber(number, decimals) {
  number = Number(number);
  return new Intl.NumberFormat("en-US", {
    /*maximumSignificantDigits: 30*/
  }).format(number.toFixed(decimals));
}
