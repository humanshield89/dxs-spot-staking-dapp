import Grid from "@mui/material/Grid";
import React from "react";
import StatComponent from "../StatComponent";
import { CustomCard } from "../Card";
import useFarms from "../../hooks/useFarms";
import useDXS from "../../hooks/useDXS";
import { formatMoneyNumber } from "../../utils/utils";
export const weekInSeconds = 604800;
const FarmsHeader = () => {
  const farms = useFarms();
  const dxs = useDXS();

  return (
    <Grid container columnSpacing={1}>
      <Grid item xs={12} sm={4}>
        <CustomCard style={{ height: "100%" }}>
          <StatComponent
            title={"Total Value Locked"}
            value={
              farms.tvl
                ? "$" + formatMoneyNumber(farms.tvl, 2)
                : farms.tvl == 0
                ? "$0"
                : null
            }
          />
        </CustomCard>
      </Grid>
      <Grid item xs={12} sm={4}>
        <CustomCard style={{ height: "100%" }}>
          <StatComponent
            title={"Total Weekly Rewards"}
            value={
              farms.globalFarmStats.rewardsPerSecond && dxs.dxsPrice
                ? "$" +
                  formatMoneyNumber(
                    (weekInSeconds *
                      Number(farms.globalFarmStats.rewardsPerSecond) *
                      dxs.dxsPrice) /
                      10 ** dxs.dxsDecimals,
                    2
                  )
                : null
            }
            subtitle={
              farms.globalFarmStats.rewardsPerSecond && dxs.dxsDecimals
                ? formatMoneyNumber(
                    (weekInSeconds * farms.globalFarmStats.rewardsPerSecond) /
                      10 ** dxs.dxsDecimals,
                    2
                  ) + " DXS"
                : null
            }
          />
        </CustomCard>
      </Grid>
      <Grid item xs={12} sm={4}>
        <CustomCard style={{ height: "100%" }}>
          <StatComponent
            title={"Total Rewards Distributed"}
            value={
              farms.globalFarmStats.totalClaimed
                ? "$" +
                  formatMoneyNumber(
                    ((Number(farms.globalFarmStats.totalClaimed) +
                      Number(farms.globalFarmStats.totalPending)) /
                      10 ** dxs.dxsDecimals) *
                      dxs.dxsPrice,
                    2
                  )
                : null
            }
            subtitle={
              farms.globalFarmStats.totalClaimed
                ? formatMoneyNumber(
                    (Number(farms.globalFarmStats.totalClaimed) +
                      Number(farms.globalFarmStats.totalPending)) /
                      10 ** dxs.dxsDecimals,
                    2
                  ) + " DXS"
                : null
            }
          />
        </CustomCard>
      </Grid>
    </Grid>
  );
};

export default FarmsHeader;
