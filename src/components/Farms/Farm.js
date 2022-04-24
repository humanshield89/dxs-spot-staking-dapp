import React, { useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import BigNumber from "bignumber.js";
import { sleep, waitForTransaction } from "../../Web3Utils/farm-core";
import { useSnackbar } from "notistack";
import { erc20ABI } from "../../Web3Utils/Abi/ERC20Abi";
import { toBN, BN } from "web3-utils";
import useSingleFarm from "../../hooks/useSingleFarm";
import useFarms from "../../hooks/useFarms";
import ConfirmDialog, { DisclaimerDialog } from "../Dialogs/ConfirmDialog";
import usePrices from "../../hooks/usePrices";
import { formatLongNumber } from "../../utils/utils";
import { approve } from "../../Web3Utils/ERC20Utils";
import useConnectWallet from "../../hooks/useConnectWallet";
import { getRealContract } from "../../Web3Utils/generalUtils";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Dialog from "@mui/material/Dialog";
import { makeStyles, useTheme } from "@mui/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Divider } from "@mui/material";
import config from "../../utils/config";
import DefaultMainHeading from "../Typography/DefaultMainHeading";
import {
  emergencyWithdrawFromFarm,
  harvest,
  stake,
  withdrawLocked,
  withdrawUnlocked,
} from "../../Web3Utils/farmUtils";
import { GradientButton } from "../GradiantButton";
import { CustomCard } from "../Card";
import useDXS from "../../hooks/useDXS";
import { weekInSeconds } from "./FarmsHeader";
import StatComponent from "../StatComponent";

const styles = makeStyles((theme) => ({
  farmBackground: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 5,
    marginBottom: "1em",
    cursor: "default",
    padding: 12,
    "-webkit-transition": "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    boxShadow: "0 0 1px 0 rgb(0 0 0 / 31%), 0 3px 4px -2px rgb(0 0 0 / 25%)",
  },
  farmName: {
    textAlign: "center",
    color: theme.palette.text.primary,
    fontWeight: "700",
  },
  farmComposition: {
    textAlign: "center",
    width: "100%",
    fontWeight: 600,
    marginTop: "0.5em",
    color: theme.palette.text.primary,
    fontSize: 14,
  },
  farmInfoHeading: {
    fontSize: "1em",
    fontWeight: 400,
    color: theme.palette.text.primary,
    width: "100%",
    textAlign: "center",
  },
  farmInfoText: {
    fontWeight: 800,
    fontSize: "1.3em",
    color: theme.palette.secondary.light,
    width: "100%",
    textAlign: "center",
    marginBottom: "0.5em",
  },
  farmImage: {
    height: "25px",
    width: "25px",
    borderRadius: "50%",
  },
  farmFunctionHeader: {
    [theme.breakpoints.down("md")]: {
      fontSize: 12,
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
    fontSize: 16,
    color: theme.palette.text.primary,
  },
  farmFunctionButton: {
    marginTop: "0.5em",
  },
  smallLink: {
    textDecoration: "underline",
  },
}));

export const ViewOnExplorerButton = ({ txHash }) => {
  return (
    <Button
      style={{ color: "#e1e1e1" }}
      onClick={() => window.open(config.explorer + "tx/" + txHash, "_blank")}
    >
      View Transaction
    </Button>
  );
};

const FarmStatItem = ({ classes, title, value, unit, formatNumber = true }) => {
  return (
    <Grid
      item
      xs={6}
      sm={4}
      md={4}
      style={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        marginBottom: 16,
      }}
    >
      <Typography className={classes.farmInfoHeading}>{title}</Typography>
      <Typography variant={"h1"} className={classes.farmInfoText}>
        {value || value == 0 ? (
          formatNumber ? (
            formatLongNumber(value, 2) + "" + (unit ? unit : "")
          ) : (
            value + "" + (unit ? unit : "")
          )
        ) : (
          <CircularProgress style={{ width: 20, height: 20 }} />
        )}
      </Typography>
    </Grid>
  );
};

const Farm = ({ expandable }) => {
  const classes = styles();
  const theme = useTheme();
  const dxs = useDXS();
  const isMobile = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const connectWallet = useConnectWallet();
  const { globalFarmStats, isInitGlobalStatsLoaded, farms, farmConfig } =
    useFarms();
  const { farm, userInfo, updateUserInfo, updateFarmInfo } = useSingleFarm();
  const priceProvider = usePrices();
  const [open, setOpen] = useState(true);

  const updateInfos = () => {
    updateUserInfo(true);
    updateFarmInfo(true);
  };

  const toggleCollapse = () => {
    setOpen(!open);
  };

  return farm ? (
    <Grid
      container
      component={CustomCard}
      item
      xs={12}
      sm={12}
      md={12}
      lg={12}
      className={classes.farmBackground}
    >
      <Grid
        container
        item
        xs={12}
        justifyContent={"center"}
        alignContent={"center"}
        direction={"column"}
        style={{ cursor: expandable ? "pointer" : "default" }}
        onClick={toggleCollapse}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            justifyItems: "center",
            flexDirection: "row",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <img src={farm.stakedToken.icon} height={48} alt={"token logo"} />
          <Typography className={classes.farmName} variant={"h4"}>
            {farm.name}{" "}
            {!isMobile && `| TVL: $${formatLongNumber(farm.tvl, 2)}`}
          </Typography>
        </Box>
        {isMobile && (
          <Typography variant={"h5"} className={classes.farmComposition}>
            TVL: ${formatLongNumber(farm.tvl, 2)}
          </Typography>
        )}
        <Typography className={classes.farmComposition}>
          {farm.name} ≈ $
          {priceProvider.lpPrices && priceProvider.lpPrices[farm.pid]
            ? toFixedSpecial(priceProvider.lpPrices[farm.pid], 11)
            : 0}
        </Typography>
        <Typography className={classes.farmComposition}>
          <a
            href={farm.buyLink}
            style={{ color: theme.palette.primary.main, fontWeight: 600 }}
            target={"_blank"}
            rel="noreferrer"
          >
            {" "}
            Get {farm.name}{" "}
          </a>
        </Typography>
      </Grid>
      <Grid item xs={12} style={{ minHeight: 20 }} />
      <Grid
        container
        justifyContent={"center"}
        style={{ padding: "1em", paddingTop: 0, paddingBottom: 0 }}
      >
        {/*APY*/}
        <FarmStatItem
          classes={classes}
          title={"APY"}
          value={farm.apy ? farm.apy : 0}
          unit={"%"}
          formatNumber={true}
        />
        {/* Deposit Fee */}
        <FarmStatItem
          classes={classes}
          title={"Multiplier"}
          value={farm.multiplier}
          unit={"X"}
          formatNumber={false}
        />
        {/* Lock period */}
        <FarmStatItem
          classes={classes}
          title={"Lock Period"}
          value={farm.lockPeriod}
          unit={" Days"}
        />
        {/* Early Unstake penalty */}
        <FarmStatItem
          classes={classes}
          title={"My Weekly Rewards"}
          value={
            userInfo
              ? Number(
                  globalFarmStats.rewardsPerSecond *
                    weekInSeconds *
                    Number(userInfo?.shareRatio)
                ) /
                10 ** dxs.dxsDecimals
              : "connect wallet"
          }
          unit={userInfo ? " DXS" : ""}
          formatNumber={!!userInfo?.shareRatio}
        />
        {/*Staked Balance*/}
        <FarmStatItem
          classes={classes}
          title={"My Stake"}
          value={
            userInfo?.staked
              ? Number(userInfo.staked / 10 ** farm.stakedToken.decimals)
              : "Connect Wallet"
          }
          unit={userInfo?.staked ? " " + farm.name : ""}
          formatNumber={!!userInfo?.staked}
        />
        {/*Claimable Balance*/}
        <FarmStatItem
          classes={classes}
          title={"Pending"}
          value={
            userInfo?.pending
              ? formatLongNumber(
                  Number(
                    Number(userInfo.pending) / 10 ** Number(dxs.dxsDecimals)
                  ),
                  2
                )
              : "Connect Wallet"
          }
          unit={userInfo?.pending ? " DXS" : ""}
          formatNumber={false}
        />
      </Grid>
      {expandable && open && (
        <>
          <Box style={{ minHeight: 20, width: "100%" }} />
          <Grid
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            container
            justifyContent={"space-evenly"}
            direction={"row"}
          >
            {userInfo &&
            Number(userInfo.allowance) > Number(userInfo.balance) ? (
              <DepositComponent />
            ) : (
              <ApproveComponent />
            )}
            <ClaimComponent />
            {userInfo &&
              userInfo.staked > 0 &&
              globalFarmStats.paused &&
              farmConfig.allowEmergencyUnstake && (
                <>
                  <VDiv />
                  <EnergencyComponent />
                </>
              )}
            {!userInfo ||
            !userInfo.deposits ||
            userInfo.deposits.length === 0 ? (
              <Grid item xs={12}>
                <Typography
                  variant={"subtitle1"}
                  style={{
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  {connectWallet.connected && !connectWallet.wrongNet ? (
                    !userInfo ? (
                      <CircularProgress style={{ width: 16, height: 16 }} />
                    ) : (
                      "You have No Stakes In This Pool"
                    )
                  ) : (
                    "Connect Wallet To See Your Stakes"
                  )}
                </Typography>
              </Grid>
            ) : (
              <Grid item xs={12} container style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                  <DefaultMainHeading style={{ fontSize: 20 }}>
                    My Stakes
                  </DefaultMainHeading>
                </Grid>
                <Grid item xs={12}>
                  <Divider
                    style={{
                      marginBottom: 12,
                      marginTop: 12,
                    }}
                  />
                </Grid>
                <Grid xs={4} item>
                  <Typography variant={"subtitle1"}>Staked Amount</Typography>
                </Grid>
                <Grid xs={4} item>
                  <Typography variant={"subtitle1"}>Unlock Time</Typography>
                </Grid>
                <Grid xs={4} item>
                  <Typography variant={"subtitle1"}>Actions</Typography>
                </Grid>
                {userInfo &&
                  userInfo.deposits &&
                  userInfo.deposits.map((deposit, index, array) => {
                    return (
                      <UserDeposit
                        userDeposit={deposit}
                        index={index}
                        key={index}
                      />
                    );
                  })}
              </Grid>
            )}
            {
              <Typography className={classes.farmComposition}>
                <Box
                  style={{
                    color: "gray",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={updateInfos}
                >
                  {" "}
                  Refresh{" "}
                </Box>
              </Typography>
            }
          </Grid>
        </>
      )}
      {!open && (
        <Grid container justifyContent={"center"}>
          <Button color={"primary"} onClick={() => setOpen(true)}>
            Click here for Details
          </Button>
        </Grid>
      )}
    </Grid>
  ) : (
    <div />
  );
};

const VDiv = () => <Grid item xs={12} style={{ minHeight: 16 }} />;

export const EnergencyComponent = () => {
  const wallet = useWallet();
  const connectWallet = useConnectWallet();
  const { enqueueSnackbar } = useSnackbar();
  const [busy, setBusy] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [open, setOpen] = useState(false);
  const { farmConfig } = useFarms();
  const { updateUserInfo, farm, userInfo, waitForApproval } = useSingleFarm();

  const preConfirm = () => {
    setOpen(true);
  };

  const emergencyWithdraw = async () => {
    setOpen(false);

    if (!wallet || !wallet.account) {
      return;
    }
    setBusy(true);
    let failed = false;
    await handleTransactionPromise({
      transactionPromise: emergencyWithdrawFromFarm(
        await connectWallet.getEthProvider(),
        farmConfig.address,
        farm.pid,
        wallet
      ),
      successMessage: "Success!",
      enqueueSnackbar,
    }).catch((error) => (failed = true));
    // TODO :
    if (!failed) {
      setWaiting(true);
      await sleep(20000); // TODO: actually listen to each block for this
      // change
      setWaiting(false);
    }
    setBusy(false);
    updateUserInfo(true);
  };

  return (
    <Grid item xs={12}>
      <CardButton
        title={
          waiting ? "Reading state from Blockchain..." : "Emergency Withdraw"
        }
        onClick={preConfirm}
        busy={busy || !userInfo}
        disabled={busy || !userInfo}
        style={{ marginTop: 8 }}
      />
      <ConfirmDialog
        open={open}
        setOpen={setOpen}
        callBack={emergencyWithdraw}
      />
    </Grid>
  );
};

export const ApproveComponent = () => {
  const wallet = useWallet();
  const { enqueueSnackbar } = useSnackbar();
  const [busy, setBusy] = useState(false);
  const [waitingForApproval, setWaitingForApproval] = useState(false);
  const { updateUserInfo, farm, userInfo, waitForApproval } = useSingleFarm();
  const { farmConfig, globalFarmStats } = useFarms();

  const approveFarm = async () => {
    if (!wallet || !wallet.account) {
      return;
    }
    setBusy(true);
    let failed = false;
    await handleTransactionPromise({
      transactionPromise: approve(
        await getRealContract(
          farm.stakedToken.address,
          wallet.ethereum,
          erc20ABI
        ),
        farmConfig.address,
        new toBN(2).pow(toBN(256)).sub(toBN("1")), // max uint 256
        // (2**256)-1 to
        // account for the
        // zero offset
        wallet
      ),
      successMessage: "Success!",
      enqueueSnackbar,
    }).catch((error) => (failed = true));
    // TODO :
    if (!failed) {
      setWaitingForApproval(true);
      await waitForApproval();
      setWaitingForApproval(false);
    }
    setBusy(false);
    updateUserInfo(true);
  };

  return (
    <Grid item xs={12} sm={6}>
      <CardButton
        title={
          waitingForApproval
            ? "Reading Approval state from Blockchain..."
            : "Approve"
        }
        onClick={approveFarm}
        busy={busy || !userInfo}
        disabled={
          busy || !userInfo || globalFarmStats.paused || !globalFarmStats.active
        }
      />
    </Grid>
  );
};

export const DepositComponent = () => {
  const wallet = useWallet();
  const connectWallet = useConnectWallet();
  const { enqueueSnackbar } = useSnackbar();
  const { updateUserInfo, farm, userInfo, waitForDepositOrWithdrawal } =
    useSingleFarm();
  const { farmConfig, globalFarmStats } = useFarms();
  const priceProvider = usePrices();

  const [value, setValue] = useState("0");
  const [useMax, setUseMax] = useState(false);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDisclaimer, setOpenDisclaimer] = useState(false);
  const [inError, setInError] = useState("");
  const [waitingForNetwork, setWaitingForNetwork] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      return;
    }
    if (
      !useMax &&
      Number(value) * 10 ** farm.stakedToken.decimals > Number(userInfo.balance)
    ) {
      setInError("Exceeded Balance");
    } else {
      setInError("");
    }
  }, [value, useMax]);

  const handleDeposit = async () => {
    setBusy(true);
    let failed = false;
    let amountToDeposit = useMax
      ? toBN(userInfo.balance.toString())
      : toBN(
          new BigNumber(value).multipliedBy(10 ** farm.stakedToken.decimals)
        );

    await handleTransactionPromise({
      transactionPromise: stake(
        await connectWallet.getEthProvider(),
        farmConfig.address,
        farm.pid,
        amountToDeposit.toString(),
        wallet
      ),
      successMessage: "Success!",
      enqueueSnackbar,
    }).catch((error) => (failed = true));
    if (!failed) {
      setWaitingForNetwork(true);
      await waitForDepositOrWithdrawal();
      setWaitingForNetwork(false);
    }
    setBusy(false);
    setOpen(false);
    updateUserInfo(true);
  };

  return (
    <Grid item xs={12} sm={6}>
      <CardButton
        title={
          waitingForNetwork
            ? "Reading On Chain Data..."
            : `Stake (available: ${
                userInfo.balance
                  ? formatLongNumber(
                      Number(userInfo.balance) /
                        10 ** farm.stakedToken.decimals,
                      2
                    )
                  : 0
              } ${farm.name}) ≈ 
                     ($${
                       userInfo?.balance
                         ? formatLongNumber(
                             (Number(userInfo.balance) /
                               10 ** farm.stakedToken.decimals) *
                               Number(
                                 priceProvider?.lpPrices
                                   ? priceProvider.lpPrices[farm.pid]
                                   : 0
                               ),
                             2
                           )
                         : formatLongNumber(0.0)
                     })`
        }
        disabled={
          !(userInfo && Number(userInfo.balance) > 0) ||
          busy ||
          globalFarmStats.paused ||
          !globalFarmStats.active
        }
        onClick={() => setOpenDisclaimer(true)}
      />
      {userInfo && (
        <AmountDialog
          title={waitingForNetwork ? "Reading On Chain Data..." : "Stake"}
          value={value}
          inError={inError}
          maxAmount={userInfo.balance}
          setUseMax={setUseMax}
          setValue={setValue}
          busy={busy}
          handleAction={handleDeposit}
          open={open}
          setOpen={setOpen}
          decimals={farm.stakedToken.decimals}
        />
      )}
      {userInfo && (
        <DisclaimerDialog
          setOpen={setOpenDisclaimer}
          open={openDisclaimer}
          callBack={() => {
            setOpenDisclaimer(false);
            setOpen(true);
          }}
        />
      )}
    </Grid>
  );
};

export const WithdrawComponent = ({ early, depositIndex, userDeposit }) => {
  const wallet = useWallet();
  const { enqueueSnackbar } = useSnackbar();
  const connectWallet = useConnectWallet();
  const { updateUserInfo, farm, userInfo, waitForDepositOrWithdrawal } =
    useSingleFarm();
  const { farmConfig, globalFarmStats } = useFarms();
  const priceProvider = usePrices();

  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [inError, setInError] = useState("");
  const [waitingForNetwork, setWaitingForNetwork] = useState(false);

  // unlocked
  const handleWithdraw = async () => {
    setBusy(true);
    let failed = false;
    await handleTransactionPromise({
      transactionPromise: !early
        ? withdrawUnlocked(
            await connectWallet.getEthProvider(),
            farmConfig.address,
            farm.pid,
            depositIndex,
            wallet
          )
        : withdrawLocked(
            await connectWallet.getEthProvider(),
            farmConfig.address,
            farm.pid,
            depositIndex,
            wallet
          ),
      successMessage: "Success!",
      enqueueSnackbar,
    }).catch((error) => (failed = true));
    if (!failed) {
      setWaitingForNetwork(true);
      await waitForDepositOrWithdrawal();
      setWaitingForNetwork(false);
    }
    setBusy(false);
    setOpen(false);
    updateUserInfo(true);
  };

  const NonPenaltyComponent = () => {
    return (
      <>
        <Alert severity={"info"}>
          You are about to unstake an unlocked deposit, Please keep in mind that
          unlocked deposits will still collect rewards even after being
          unlocked, once withdrawn you will no longer receive any rewards.
        </Alert>
      </>
    );
  };

  const PenaltyComponent = () => {
    return (
      <>
        <Typography variant={"body1"}>
          You are about to withdraw early, withdrawing early will have a{" "}
          {farm.penalty}% loss on your deposit
        </Typography>
        <Box style={{ minHeight: 20 }} />
        <Typography variant={"subtitle2"}>
          <b>Original Deposit:</b>{" "}
          {formatLongNumber(
            userDeposit.amount / 10 ** farm.stakedToken.decimals,
            2
          )}
        </Typography>
        <Typography variant={"subtitle2"}>
          <b>You will Receive:</b>{" "}
          {formatLongNumber(
            (userDeposit.amount / 10 ** farm.stakedToken.decimals) *
              (1 - farm.penalty / 100),
            2
          )}
        </Typography>
        <Box style={{ minHeight: 20 }} />
        <Alert severity={"error"}>This action CANNOT be undone</Alert>
      </>
    );
  };

  return (
    <Grid item xs={12} style={{ paddingLeft: 6 }}>
      <CardButton
        danger={early}
        title={
          waitingForNetwork
            ? "Reading On Chain Data..."
            : `${early ? "Unstake" : "Unstake"} (${
                userInfo && userDeposit.amount
                  ? formatLongNumber(
                      Number(userDeposit.amount) /
                        10 ** farm.stakedToken.decimals,
                      2
                    )
                  : 0
              })
                ≈ ($${
                  userInfo && userDeposit.amount && priceProvider.lpPrices
                    ? formatLongNumber(
                        (Number(userDeposit.amount) /
                          10 ** farm.stakedToken.decimals) *
                          priceProvider.lpPrices[farm.pid],
                        2
                      )
                    : 0
                })
                `
        }
        disabled={
          !(userInfo && Number(userDeposit.amount) > 0) ||
          busy ||
          globalFarmStats.paused ||
          early
        }
        onClick={() => setOpen(true)}
      />
      {userInfo && (
        <UnlockedDialog
          early={early}
          title={waitingForNetwork ? "Reading On Chain Data..." : "Withdraw"}
          inError={inError}
          busy={busy}
          handleAction={handleWithdraw}
          open={open}
          setOpen={setOpen}
          userDeposit={userDeposit}
        >
          {early ? <PenaltyComponent /> : <NonPenaltyComponent />}
        </UnlockedDialog>
      )}
    </Grid>
  );
};

export const ClaimComponent = () => {
  const wallet = useWallet();
  const { updateUserInfo, farm, userInfo, waitForClaim } = useSingleFarm();
  const dxs = useDXS();
  const [busy, setBusy] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [waitingForNetwork, setWaitingForNetwork] = useState(false);
  const { farmConfig, globalFarmStats } = useFarms();
  const priceProvider = usePrices();
  const connectWallet = useConnectWallet();
  const handleHarvest = async () => {
    setBusy(true);
    let failed = false;
    await handleTransactionPromise({
      transactionPromise: harvest(
        await connectWallet.getEthProvider(),
        farmConfig.address,
        farm.pid,
        wallet
      ),
      successMessage: "Success! Your DXS will show in your balance shortly",
      enqueueSnackbar,
    }).catch((error) => (failed = true));

    if (!failed) {
      setWaitingForNetwork(true);
      await waitForClaim();
      setWaitingForNetwork(false);
    }

    setBusy(false);
    updateUserInfo(true);
  };

  return (
    <Grid item xs={12} sm={6}>
      <CardButton
        title={
          waitingForNetwork
            ? "Reading On Chain Data..."
            : `Harvest
                ≈ ($${
                  userInfo && userInfo.pending
                    ? formatLongNumber(
                        (Number(userInfo.pending) /
                          10 ** Number(dxs.dxsDecimals)) *
                          Number(dxs.dxsPrice),
                        2
                      )
                    : 0
                })`
        }
        disabled={
          !(userInfo && Number(userInfo.pending) > 0) ||
          busy ||
          globalFarmStats.paused
        }
        busy={busy}
        onClick={handleHarvest}
      />
    </Grid>
  );
};

const CardButton = ({ title, disabled, busy, onClick, danger }) => {
  const wallet = useWallet();
  const walletConnect = useConnectWallet();

  const handleConnect = () => {
    if (wallet.status !== "connected") {
      walletConnect.connect();
    } else if (wallet.status === "connected" && walletConnect.wrongNet) {
      walletConnect.switchNetwork();
    }
  };

  return (
    <GradientButton
      danger={danger}
      disabled={wallet && wallet.status === "connected" && disabled} // ignore disabled when not connected to wallet
      variant={"contained"}
      fullWidth
      onClick={
        wallet && wallet.status === "connected" && !walletConnect.wrongNet
          ? onClick
          : handleConnect
      }
    >
      {busy && (
        <CircularProgress style={{ height: 24, width: 24, marginRight: 6 }} />
      )}
      {wallet &&
        wallet.status !== "connected" &&
        !walletConnect.wrongNet &&
        `Connect Wallet`}
      {wallet &&
        wallet.status === "connected" &&
        !walletConnect.wrongNet &&
        title}
      {wallet &&
        wallet.status === "connected" &&
        walletConnect.wrongNet &&
        `Switch to BSC`}
    </GradientButton>
  );
};

export const UnlockedDialog = ({
  open,
  setOpen,
  handleAction,
  busy,
  inError,
  userDeposit,
  title,
  children,
  early,
}) => {
  const theme = useTheme();
  return (
    <Dialog
      open={open}
      maxWidth={"sm"}
      onClose={() => setOpen(false)}
      PaperProps={{
        style: {
          background: theme.palette.background.paperOpaque,
        },
      }}
    >
      <DialogTitle
        style={{ backgroundColor: early ? "#FF4D21" : "transparent" }}
      >
        <Typography variant={"h4"}>{title}</Typography>
      </DialogTitle>
      <DialogContent dividers>
        {children}
        <Grid container spacing={2} style={{ marginTop: 6 }}>
          <Grid item xs={6}>
            <GradientButton
              danger={early}
              variant={"contained"}
              fullWidth
              disabled={busy || inError}
              onClick={handleAction}
            >
              {busy && (
                <CircularProgress
                  style={{
                    height: 24,
                    width: 24,
                    marginRight: 6,
                  }}
                />
              )}
              {title}
            </GradientButton>
          </Grid>
          <Grid item xs={6}>
            <GradientButton
              style={{ borderRadius: 6 }}
              color={"primary"}
              variant={"contained"}
              fullWidth
              disabled={busy}
              onClick={() => setOpen(false)}
              text={"Cancel"}
            >
              Cancel
            </GradientButton>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export const AmountDialog = ({
  title,
  inError,
  value,
  setValue,
  setUseMax,
  maxAmount,
  setOpen,
  open,
  handleAction,
  busy,
  decimals,
  children,
}) => {
  if (!decimals) console.error("No decimals ");
  return (
    <Dialog
      fullWidth={true}
      maxWidth={"sm"}
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        style: {
          //background: "linear-gradient(45deg, #151935 0, #151935 150%)",
        },
      }}
    >
      <DialogTitle
        style={{ backgroundColor: useTheme().palette.background.paperOpaque }}
      >
        <Typography variant={"h4"}>{title}</Typography>
      </DialogTitle>

      <DialogContent
        dividers
        style={{ backgroundColor: useTheme().palette.background.paperOpaque }}
      >
        {children}
        <Alert
          severity={"info"}
          style={{
            marginTop: 6,
            marginBottom: 24,
          }}
        >{`Current Balance: ${formatLongNumber(
          Number(maxAmount) / 10 ** decimals,
          2
        )}`}</Alert>
        <FormControl
          error={!!inError}
          fullWidth
          color={
            "secondary"
          } /*className={clsx(classes.margin, classes.textField)}*/
          variant="outlined"
        >
          <InputLabel>Amount</InputLabel>
          <OutlinedInput
            label={"Amount"}
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
            endAdornment={
              <InputAdornment position="end">
                <Button
                  style={{ color: "white" }}
                  onClick={() => {
                    setValue("" + Number(maxAmount) / 10 ** decimals);
                    setUseMax(true);
                  }}
                >
                  Use Max
                </Button>
              </InputAdornment>
            }
            labelWidth={64}
          />
        </FormControl>
        {inError && (
          <Alert severity={"error"} style={{ marginTop: 6, marginBottom: 6 }}>
            {inError}
          </Alert>
        )}
        <Grid container spacing={2} style={{ marginTop: 6 }}>
          <Grid item xs={6}>
            <GradientButton
              variant={"contained"}
              fullWidth
              color={"secondary"}
              disabled={busy || inError}
              onClick={handleAction}
            >
              {busy && (
                <CircularProgress
                  style={{
                    height: 24,
                    width: 24,
                    marginRight: 6,
                  }}
                />
              )}
              {title}
            </GradientButton>
          </Grid>
          <Grid item xs={6}>
            <GradientButton
              style={{ borderRadius: 6 }}
              color={"primary"}
              variant={"contained"}
              fullWidth
              disabled={busy}
              onClick={() => setOpen(false)}
              text={"Cancel"}
            >
              Cancel
            </GradientButton>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

const UserDeposit = ({ userDeposit, index, ...rest }) => {
  const { farm } = useSingleFarm();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.between("xs", "sm"));

  return (
    <>
      <Grid item xs={12}>
        <Divider
          style={{ marginBottom: 1, marginTop: 0, backgroundColor: "white" }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        container
        style={{ backgroundColor: "#ff000022", padding: 8 }}
      >
        {!isMobile && (
          <Grid xs={4} item style={{ display: "flex" }}>
            <Typography variant={"subtitle1"} style={{ margin: "auto" }}>
              {formatLongNumber(
                userDeposit.amount / 10 ** farm.stakedToken.decimals,
                4
              )}{" "}
              {farm.stakedToken.symbol}
            </Typography>
          </Grid>
        )}
        <Grid xs={6} md={4} item style={{ display: "flex" }}>
          <Typography variant={"subtitle1"} style={{ margin: "auto" }}>
            {new Date(Number(userDeposit.unlockTime * 1000)).toDateString()}
          </Typography>
        </Grid>
        <Grid xs={6} md={4} item>
          <WithdrawComponent
            userDeposit={userDeposit}
            early={Date.now() / 1000 < userDeposit.unlockTime}
            depositIndex={index}
            style={{ flexGrow: 1, width: "100%" }}
          />
        </Grid>
      </Grid>
    </>
  );
};

// functions
const handleTransactionPromise = async ({
  transactionPromise,
  successMessage,
  enqueueSnackbar,
}) => {
  let tx;
  try {
    tx = await transactionPromise;
    const receipt = await waitForTransaction(tx);

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

export default Farm;

function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    let e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    let e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join("0");
    }
  }
  return x;
}

const toFixedSpecial = function (number, decimals) {
  var str = number.toFixed(decimals);
  if (str.indexOf("e+") === -1) return str;

  // if number is in scientific notation, pick (b)ase and (p)ower
  str = str
    .replace(".", "")
    .split("e+")
    .reduce(function (b, p) {
      return b + Array(p - b.length + 2).join(0);
    });

  if (decimals > 0) str += "." + Array(decimals + 1).join(0);

  return str;
};
