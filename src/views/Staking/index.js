/*
import Page from "../../components/Page";
import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/system";
import Divider from "@mui/material/Divider";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Collapse from "@mui/material/Collapse";
import StatComponent from "../../components/StatComponent";
import useDXS from "../../hooks/useDXS";
import useConnectWallet from "../../hooks/useConnectWallet";
import { formatMoneyNumber } from "../../utils/utils";
import Alert from "@mui/material/Alert";
import {
  getRealContract,
  waitForTransaction,
} from "../../Web3Utils/generalUtils";
import { useWallet } from "use-wallet";
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";
import { toBN, toWei } from "web3-utils";
import { approve } from "../../Web3Utils/ERC20Utils";
import { erc20ABI } from "../../Web3Utils/Abi/ERC20Abi";
import { CustomCard } from "../../components/Card";

const Notice = ({}) => {
  const jup = useDXS();
  return (
    <Grid item xs={12}>
      {jup?.farmIsPaused && (
        <Alert severity={"error"} style={{ marginBottom: 16 }}>
          Farms is paused by admin, please check social channels to learn more.
        </Alert>
      )}
      {jup.farmStartTime == 0 && (
        <Alert severity={"warning"} style={{ marginBottom: 16 }}>
          Farms did not start yet, No start date is set at the moment
        </Alert>
      )}
      {jup.farmStartTime && Date.now() < jup.farmStartTime * 1000 && (
        <Alert severity={"info"}>
          Farms Will start on{" "}
          {new Date(jup.farmStartTime * 1000).toLocaleString()}
        </Alert>
      )}
    </Grid>
  );
};

const styles = makeStyles((theme) => ({
  centerBox: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: "16px",
  },
}));

const Staking = () => {
  const classes = styles();
  const theme = useTheme();
  const jup = useDXS();
  const { connected, connect, switchNetwork, wrongNet } = useConnectWallet();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Page title={"Staking"}>
      <Box style={{ width: "100%", height: "100%" }}>
        <Grid container spacing={2}>
          <Notice jup={jup} theme={theme} />
          <Grid item xs={12} md={6}>
            <CustomCard style={{ padding: 0 }}>
              <Typography
                variant={"h3"}
                component={"h1"}
                style={{
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: "7px 7px 0px 0px",
                  color: theme.palette.background.paper,
                  padding: "0.3em",
                }}
              >
                Liquidity Staking
              </Typography>
              <Box className={classes.centerBox}>
                <img src={"/token-icons/DXSBNB.png"} height={60} />
                <Typography variant={"h5"} component={"h1"}>
                  DXS-BNB LP
                </Typography>
              </Box>
              <Divider orientation={"horizontal"} />
              <ClaimComponent classes={classes} />
              <Divider orientation={"horizontal"} />
              <Box
                className={classes.centerBox}
                style={{ borderRadius: 5, width: "100%", paddingBottom: 0 }}
              >
                <Tabs
                  variant={"fullWidth"}
                  centered
                  value={value}
                  onChange={handleChange}
                  indicatorColor={"primary"}
                  style={{ display: "flex", fontWeight: 700, width: "100%" }}
                >
                  <Tab
                    label="Stake"
                    style={{
                      minWidth: "40%",
                      margin: 0,
                      fontWeight: 800,
                      fontSize: 16,
                      backgroundColor:
                        value === 0
                          ? theme.palette.primary.main
                          : "transparent",
                      color:
                        value === 0
                          ? theme.palette.background.paper
                          : theme.palette.primary.main,
                      //border: `1px solid ${theme.palette.primary.main}`,
                      transition: "all 0.5s",
                      borderRadius: "7px 7px 0px 0px",
                    }}
                  />
                  <Tab
                    label="Unstake"
                    style={{
                      minWidth: "40%",
                      margin: 0,
                      fontWeight: 800,
                      fontSize: 16,
                      backgroundColor:
                        value === 1
                          ? theme.palette.primary.main
                          : "transparent",
                      color:
                        value === 1
                          ? theme.palette.background.paper
                          : theme.palette.primary.main,
                      //border: `1px solid ${theme.palette.primary.main}`,
                      transition: "all 0.5s",
                      borderRadius: "7px 7px 0px 0px",
                    }}
                  />
                </Tabs>
              </Box>
              <Collapse in={value === 0}>
                <Box
                  className={classes.centerBox}
                  style={{
                    //display: value===0 ? 'flex' : 'none',
                    borderRadius: "0px 0px 7px 7px",
                    marginRight: 16,
                    marginLeft: 16,
                    marginBottom: 16,
                    border: `2px solid ${theme.palette.primary.main}`,
                    transition: "all 1s",
                  }}
                >
                  <StakeAmountForm classes={classes} />
                </Box>
              </Collapse>
              <Collapse in={value === 1}>
                <Box
                  className={classes.centerBox}
                  style={{
                    //display: value===1 ? 'flex' : 'none',
                    borderRadius: "0px 0px 7px 7px",
                    marginRight: 16,
                    marginLeft: 16,
                    marginBottom: 16,
                    border: `2px solid ${theme.palette.primary.main}`,
                  }}
                >
                  <UnStakeAmountForm classes={classes} />
                </Box>
              </Collapse>
              <Box style={{ minHeight: 16 }} />
              {jup.farmIsPaused && (
                <>
                  <Button
                    size={"large"}
                    color={"error"}
                    variant={"contained"}
                    disabled={
                      !connected ||
                      !jup.userStaked ||
                      jup.userStaked == 0 ||
                      jup.farmIsPaused
                    }
                    style={{
                      color: theme.palette.background.paper,
                      minWidth: "95%",
                    }}
                  >
                    Emergency Withdraw
                  </Button>
                  <Box style={{ minHeight: 16 }} />
                </>
              )}
            </CustomCard>
          </Grid>
          <ExtraCards />
        </Grid>
      </Box>
    </Page>
  );
};

const StakeAmountForm = ({ classes, ...rest }) => {
  const theme = useTheme();
  const jup = useDXS();
  const wallet = useWallet();
  const { connected, getEthProvider } = useConnectWallet();
  const { enqueueSnackbar } = useSnackbar();

  const [value, setValue] = useState("");
  const [maxAmount, setMaxAmount] = useState("0");
  const [inError, setInError] = useState("");
  const [useMax, setUseMax] = useState(false);

  const [busy, setBusy] = useState(false);
  const [waitingForNetwork, setWaitingForNetwork] = useState(false);

  useEffect(() => {
    if (jup.userLPBalance) {
      setMaxAmount(jup.userLPBalance / 10 ** 18);
    } else {
      setMaxAmount("0");
    }
  }, [jup.userLPBalance]);

  useEffect(() => {
    if (!useMax && Number(value) * 10 ** 18 > Number(jup.userLPBalance)) {
      setInError("Exceeded Balance");
    } else {
      setInError("");
    }
  }, [value, useMax]);

  const handleDeposit = async () => {
    setBusy(true);
    let failed = false;
    await handleTransactionPromise({
      transactionPromise: deposit(
        await getRealContract(
          jup.configs.stakingAddress,
          await getEthProvider(),
          stakingABI,
          "place 4"
        ),
        useMax ? jup.userLPBalance : toWei(value),
        wallet
      ),
      successMessage: "Success!",
      enqueueSnackbar,
      ethereum: await getEthProvider(),
    })
      .catch((error) => (failed = true))
      .finally(() => setBusy(false));
    if (!failed) {
      setWaitingForNetwork(true);
      await jup.waitForDepositOrWithdrawal();
      setWaitingForNetwork(false);
    }
    setBusy(false);
    setValue("");
    await jup.init();
  };

  return (
    <Box
      {...rest}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        rowGap: 24,
        width: "100%",
      }}
    >
      <Box className={classes.centerBox} style={{ padding: 6 }}>
        <StatComponent
          title={"LP Balance"}
          value={
            connected
              ? `${
                  jup.userLPBalance || jup.userLPBalance == 0
                    ? formatMoneyNumber(jup.userLPBalance / 10 ** 18, 2) +
                      " DXS-BNB LP"
                    : ""
                }`
              : "Connect Wallet"
          }
          subtitle={
            connected
              ? `${
                  jup.userLPBalance || jup.userLPBalance == 0
                    ? "$" +
                      formatMoneyNumber(
                        (jup.userLPBalance / 10 ** 18) * jup.lpPrice,
                        2
                      )
                    : ""
                }`
              : "Connect Wallet"
          }
        />
      </Box>
      <FormControl
        disabled={
          !connected ||
          !jup.userLPBalance ||
          jup.userLPBalance == 0 ||
          jup.farmIsPaused ||
          busy
        }
        error={inError}
        fullWidth
        color={"secondary"}
        variant="outlined"
      >
        <InputLabel>Stake LP</InputLabel>
        <OutlinedInput
          label={"Stake LP"}
          type={"number"}
          fullWidth
          value={value}
          onChange={(event) => {
            setValue(
              Number(event.target.value) || Number(event.target.value) === 0
                ? event.target.value
                : value
            );
            setUseMax(false);
          }}
          onFocus={() => {
            if (value == 0) {
              setValue("");
            }
          }}
          endAdornment={
            <InputAdornment position="end">
              <Button
                disabled={
                  !connected ||
                  !jup.userLPBalance ||
                  jup.userLPBalance == 0 ||
                  jup.farmIsPaused ||
                  busy
                }
                //style={{ color: 'white' }}
                onClick={() => {
                  setValue("" + Number(maxAmount));
                  setUseMax(true);
                }}
              >
                Use Max
              </Button>
            </InputAdornment>
          }
        />
      </FormControl>
      {inError && (
        <Alert severity={"error"} style={{ marginTop: 6, marginBottom: 6 }}>
          {inError}
        </Alert>
      )}
      {jup.userAllowance == 0 || jup.userAllowance < maxAmount ? (
        <ApproveComponent />
      ) : (
        <Button
          disabled={
            !connected ||
            !jup.userLPBalance ||
            jup.userLPBalance == 0 ||
            jup.farmIsPaused ||
            !!inError ||
            !value ||
            busy
          }
          size={"large"}
          variant={"contained"}
          fullWidth
          style={{ color: theme.palette.background.paper }}
          onClick={handleDeposit}
        >
          {busy && <CircularProgress size={16} style={{ marginRight: 6 }} />}
          {busy
            ? waitingForNetwork
              ? "Reading On Chain Data"
              : "Staking..."
            : "Stake"}
        </Button>
      )}
    </Box>
  );
};

const UnStakeAmountForm = ({ classes, ...rest }) => {
  const theme = useTheme();
  const jup = useDXS();
  const { connected, getEthProvider } = useConnectWallet();
  const wallet = useWallet();
  const { enqueueSnackbar } = useSnackbar();

  const [maxAmount, setMaxAmount] = useState("0");
  const [value, setValue] = useState("");
  const [inError, setInError] = useState("");
  const [useMax, setUseMax] = useState(false);

  const [waitingForNetwork, setWaitingForNetwork] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (jup.userStaked) {
      setMaxAmount(jup.userStaked / 10 ** 18);
    } else {
      setMaxAmount("0");
    }
  }, [jup.userStaked]);

  useEffect(() => {
    if (!useMax && Number(value) * 10 ** 18 > Number(jup.userStaked)) {
      setInError("Exceeded Balance");
    } else {
      setInError("");
    }
  }, [value, useMax]);

  const handleWithdraw = async () => {
    setBusy(true);
    let failed = false;
    await handleTransactionPromise({
      transactionPromise: withdraw(
        await getRealContract(
          jup.configs.stakingAddress,
          await getEthProvider(),
          stakingABI,
          "place 5"
        ),
        useMax ? jup.userStaked : toWei(value),
        wallet
      ),
      successMessage: "Success!",
      enqueueSnackbar,
      ethereum: await getEthProvider(),
    }).catch((error) => (failed = true));
    if (!failed) {
      setWaitingForNetwork(true);
      await jup.waitForDepositOrWithdrawal();
      setWaitingForNetwork(false);
    }
    await jup.init();
    setValue("");
    setBusy(false);
  };

  return (
    <Box
      {...rest}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        rowGap: 24,
        width: "100%",
      }}
    >
      <Box className={classes.centerBox} style={{ padding: 6 }}>
        <StatComponent
          title={"LP Staked"}
          value={
            connected
              ? `${
                  jup.userStaked || jup.userStaked == 0
                    ? formatMoneyNumber(jup.userStaked / 10 ** 18, 2) +
                      " DXS-BNB LP"
                    : ""
                }`
              : "Connect Wallet"
          }
          subtitle={
            connected
              ? `${
                  jup.userStaked || jup.userStaked == 0
                    ? "$" +
                      formatMoneyNumber(
                        (jup.userStaked / 10 ** 18) * jup.lpPrice,
                        2
                      )
                    : ""
                }`
              : "Connect Wallet"
          }
        />
      </Box>
      <FormControl
        error={!!inError}
        disabled={
          !connected ||
          !jup.userStaked ||
          jup.userStaked == 0 ||
          jup.farmIsPaused
        }
        fullWidth
        color={"secondary"}
        variant="outlined"
      >
        <InputLabel>Staked LP</InputLabel>
        <OutlinedInput
          label={"Staked LP"}
          type={"number"}
          fullWidth
          value={value}
          onChange={(event) => {
            setValue(
              Number(event.target.value) || Number(event.target.value) === 0
                ? event.target.value
                : value
            );
            setUseMax(false);
          }}
          onFocus={() => {
            if (value == 0) {
              setValue("");
            }
          }}
          endAdornment={
            <InputAdornment position="end">
              <Button
                disabled={
                  !connected ||
                  !jup.userStaked ||
                  jup.userStaked == 0 ||
                  jup.farmIsPaused
                }
                onClick={() => {
                  setValue("" + Number(maxAmount));
                  setUseMax(true);
                }}
              >
                Use Max
              </Button>
            </InputAdornment>
          }
        />
      </FormControl>
      <Button
        disabled={
          !connected ||
          !jup.userStaked ||
          jup.userStaked == 0 ||
          jup.farmIsPaused ||
          busy ||
          waitingForNetwork ||
          !value
        }
        size={"large"}
        variant={"contained"}
        fullWidth
        style={{
          color: busy
            ? theme.palette.text.main
            : theme.palette.background.paper,
        }}
        onClick={handleWithdraw}
      >
        {busy && <CircularProgress size={16} style={{ marginRight: 6 }} />}
        {busy
          ? waitingForNetwork
            ? "Reading On Chain Data"
            : "Unstaking..."
          : "Unstake"}
      </Button>
    </Box>
  );
};

const ClaimComponent = ({ classes }) => {
  const theme = useTheme();
  const jup = useDXS();
  const wallet = useWallet();
  const { connected, connect, switchNetwork, wrongNet, getEthProvider } =
    useConnectWallet();
  const [busy, setBusy] = useState(false);
  const [waitingForNetwork, setWaitingForNetwork] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleHarvest = async () => {
    setBusy(true);
    let failed = false;
    await handleTransactionPromise({
      transactionPromise: harvest(
        await getRealContract(
          jup.configs.stakingAddress,
          await getEthProvider(),
          stakingABI,
          "place 6"
        ),
        wallet
      ),
      successMessage: "Success! Your $DXS will show in your balance shortly",
      enqueueSnackbar,
      ethereum: await getEthProvider(),
    }).catch((error) => (failed = true));

    if (!failed) {
      setWaitingForNetwork(true);
      await jup.waitForClaim();
      setWaitingForNetwork(false);
    }
    await jup.init();
    setBusy(false);
  };

  return (
    <Box
      className={classes.centerBox}
      style={{ paddingTop: 12, paddingBottom: 12 }}
    >
      <StatComponent
        title={"My Rewards: (DXS)"}
        value={
          connected
            ? jup.userPending || jup.userPending == 0
              ? formatMoneyNumber(jup.userPending / 10 ** 18, 2) + " DXS"
              : ""
            : "Connect Wallet"
        }
        subtitle={
          jup.userPending || jup.userPending == 0
            ? "$" +
              formatMoneyNumber((jup.userPending / 10 ** 18) * jup.jupPrice, 2)
            : ""
        }
      />
      <Box style={{ flexGrow: 1 }} />
      <Button
        disabled={
          connected &&
          (!jup.userPending || jup.userPending == 0 || jup.farmIsPaused || busy)
        }
        variant={"contained"}
        size={"large"}
        onClick={() => {
          if (!connected) {
            connect();
          } else if (wrongNet) {
            switchNetwork();
          } else {
            // Claim
            handleHarvest();
          }
        }}
        style={{
          color: theme.palette.background.paper,
          width: "40%",
        }}
      >
        {busy && <CircularProgress size={16} style={{ marginRight: 6 }} />}
        {connected
          ? waitingForNetwork
            ? "Reading On Chain Data"
            : "Claim"
          : !connected && wrongNet
          ? "Switch to BSC"
          : "Connect Wallet"}
      </Button>
    </Box>
  );
};

export const ApproveComponent = () => {
  const wallet = useWallet();
  const connectWallet = useConnectWallet();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [busy, setBusy] = useState(false);
  const [waitingForApproval, setWaitingForApproval] = useState(false);
  const jup = useDXS();

  const approveFarm = async () => {
    if (!wallet || !wallet.account) {
      return;
    }
    setBusy(true);
    let failed = false;
    await handleTransactionPromise({
      transactionPromise: approve(
        await getRealContract(
          jup.configs.lpPairAddress,
          wallet.ethereum,
          erc20ABI
        ),
        jup.configs.stakingAddress,
        new toBN(2).pow(toBN(256)).sub(toBN("1")), // max uint 256 (2**256)-1
        // to account for the zero
        // offset
        wallet
      ),
      successMessage: "Success!",
      enqueueSnackbar,
      ethereum: await connectWallet.getEthProvider(),
    }).catch((error) => (failed = true));
    // TODO :
    if (!failed) {
      setWaitingForApproval(true);
      await jup.waitForApproval();
      setWaitingForApproval(false);
    }
    await jup.init();
    setBusy(false);
  };

  return (
    <Button
      variant={"contained"}
      style={{ color: theme.palette.background.paper }}
      onClick={approveFarm}
      busy={busy || (!jup.userAllowance && jup.userAllowance != 0)}
      disabled={busy || jup.farmIsPaused}
    >
      {busy && <CircularProgress size={16} style={{ marginRight: 6 }} />}
      {waitingForApproval
        ? "Reading Approval state from Blockchain..."
        : "Approve"}
    </Button>
  );
};

const ExtraCards = () => {
  const theme = useTheme();
  const jup = useDXS();
  return (
    <Grid item xs={12} md={6}>
      <CustomCard style={{ padding: 16 }}>
        <StatComponent
          title={"APY"}
          value={
            jup.farmAPY || jup.farmAPY == 0
              ? `${formatMoneyNumber(jup.farmAPY * 100, 2)}%`
              : ""
          }
        />
      </CustomCard>
      <Box style={{ minHeight: 16 }} />
      <CustomCard style={{ padding: 16 }}>
        <StatComponent
          title={"TVL"}
          value={
            jup.poolInfo?.totalStakedAmount ||
            jup.poolInfo?.totalStakedAmount == 0
              ? formatMoneyNumber(
                  jup.poolInfo?.totalStakedAmount / 10 ** 18,
                  2
                ) + " DXS"
              : ""
          }
          subtitle={
            (jup.poolInfo?.totalStakedAmount ||
              jup.poolInfo?.totalStakedAmount == 0) &&
            jup.lpPrice
              ? "$" +
                formatMoneyNumber(
                  (jup.poolInfo?.totalStakedAmount / 10 ** 18) * jup.lpPrice,
                  2
                )
              : ""
          }
        />
      </CustomCard>
      <Box style={{ minHeight: 16 }} />
      <CustomCard style={{ padding: 16 }}>
        <StatComponent
          title={"Total Rewards Distributed"}
          value={
            jup.farmTotalDistributed || jup.farmTotalDistributed == 0
              ? formatMoneyNumber(jup.farmTotalDistributed / 10 ** 18, 2) +
                " DXS"
              : ""
          }
          subtitle={
            (jup.farmTotalDistributed || jup.farmTotalDistributed == 0) &&
            jup.jupPrice
              ? "$" +
                formatMoneyNumber(
                  (jup.farmTotalDistributed / 10 ** 18) * jup.jupPrice,
                  2
                )
              : ""
          }
        />
      </CustomCard>
      <Box style={{ minHeight: 16 }} />
      <CustomCard style={{ padding: 16 }}>
        <Typography variant={"h3"}>How To Stake</Typography>
        <Typography
          variant={"subtitle1"}
          style={{ textAlign: "left", paddingLeft: 16 }}
        >
          <ol>
            <li>
              Buy DXS Token On{" "}
              <a
                target={"_blank"}
                href={`https://pancakeswap.finance/swap?outputCurrency=${jup.configs.dxsTokenAddress}`}
                style={{ color: theme.palette.secondary.main }}
              >
                PancakeSwap
              </a>
            </li>
            <li>
              Provide DXS-BNB liquidity on{" "}
              <a
                target={"_blank"}
                style={{ color: theme.palette.secondary.main }}
                href={`https://pancakeswap.finance/add/BNB/${jup.configs.dxsTokenAddress}`}
              >
                PancakeSwap
              </a>
            </li>
            <li>Stake DXS-BNB Lp Token and enjoy 9%* rewards daily</li>
          </ol>
        </Typography>
      </CustomCard>
      <Box style={{ minHeight: 16 }} />
      <CustomCard style={{ padding: 0 }}>
        <Alert severity={"info"}>
          <b>Note:</b> Staking or Unstaking Claims Pending Rewards
        </Alert>
      </CustomCard>
    </Grid>
  );
};
export default Staking;

export const ViewOnExplorerButton = ({ txHash }) => {
  const { configs } = useDXS();

  return (
    <Button
      style={{ color: "#e1e1e1" }}
      onClick={() => window.open(configs.explorer + "tx/" + txHash, "_blank")}
    >
      View Transaction
    </Button>
  );
};

// functions
const handleTransactionPromise = async ({
  transactionPromise,
  successMessage,
  enqueueSnackbar,
  ethereum,
}) => {
  let tx;
  try {
    tx = await transactionPromise;
    const receipt = await waitForTransaction(tx, ethereum);

    if (receipt.status) {
      // transaction mined and did not revert
      enqueueSnackbar(successMessage, {
        variant: "success",
        autoHideDuration: 4000,
        action: <ViewOnExplorerButton txHash={tx} />,
      });
    } else {
      // transaction mined and did revert
      enqueueSnackbar("Transaction Reverted 😢", {
        variant: "error",
        autoHideDuration: 3000,
        action: <ViewOnExplorerButton txHash={tx} />,
      });
    }
  } catch (error) {
    enqueueSnackbar(error.message, {
      variant: "error",
      autoHideDuration: 3000,
      action: <ViewOnExplorerButton txHash={tx} />,
    });
    throw "error";
  }
};
*/
