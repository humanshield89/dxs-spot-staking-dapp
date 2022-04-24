import { Typography } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import useConnectWallet from "../../hooks/useConnectWallet";
import { useWallet } from "use-wallet";
import useMediaQuery from "@mui/material/useMediaQuery";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { THEMES } from "../../constants";
import Tooltip from "@mui/material/Tooltip";
import { Moon, Sun } from "react-feather";
import useSettings from "../../hooks/useSettings";
import DisconnectDialog from "../../components/DisconnectDialog/DisconnectDialog";
import { CustomCard } from "../../components/Card";
import { GradientButton } from "../../components/GradiantButton";

const topBarStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    maxHeight: 108,
    padding: 12,
    zIndex: 1,
    borderRadius: 7,

    display: "flex",
    alignItems: "center",
  },
  logo: {
    marginRight: theme.spacing(2),
  },
  title: {
    marginLeft: 16,
    fontWeight: 700,
    fontSize: "1.3em",
    color: theme.palette.primary.main,
  },
}));

const Header = ({ className, ...rest }) => {
  const classes = topBarStyles();
  const { wrongNet, switchNetwork, connect } = useConnectWallet();
  const wallet = useWallet();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const { settings, saveSettings } = useSettings();
  const [open, setOpen] = useState(false);

  const handleLightDarkClick = () => {
    saveSettings({
      theme: settings.theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT,
    });
  };
  function onConnect() {
    if (wallet.status !== "connected") connect();
    else if (wallet.status === "connected" && wrongNet) switchNetwork();
    else if (wallet.status === "connected") setOpen(true);
  }

  return (
    <CustomCard
      elevation={3}
      className={classes.root}
      style={{ border: "none" }}
    >
      <img src={"images/logo.png"} height={isMobile ? 50 : 80} alt={"logo"} />
      {/*!isMobile && (
        <Typography variant={"h2"} className={classes.title + ' gradient-text'}>
          DX Spot Staking
        </Typography>
      )*/}
      <Box style={{ flexGrow: 1 }} />
      <GradientButton
        variant={"outlined"}
        onClick={() => onConnect()}
        style={{ marginRight: 6, border: "none" }}
      >
        {wallet.status === "connected" &&
          !wrongNet &&
          `${
            wallet.account.substring(0, 6) +
            "..." +
            wallet.account.substring(
              wallet.account.length - 4,
              wallet.account.length
            )
          }`}
        {wallet.status !== "connected" && `Connect Wallet`}
        {wallet.status === "connected" && wrongNet && `Switch to BSC`}
      </GradientButton>
      <DisconnectDialog open={open} setOpen={setOpen} />
      {/*<Tooltip
        title={
          settings.theme === THEMES.LIGHT
            ? 'Switch to DarkMode'
            : 'Switch to LightMode'
        }
      >
        <Button
          variant={'outlined'}
          style={{
            color:
              settings.theme === THEMES.LIGHT
                ? theme.palette.primary.main
                : theme.palette.primary.main,
            borderWidth: 2,
          }}
          onClick={handleLightDarkClick}
        >
          {settings.theme === THEMES.LIGHT ? <Moon/> : <Sun/>}
        </Button>
      </Tooltip>*/}
    </CustomCard>
  );
};

export default Header;
