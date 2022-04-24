import React, { useEffect } from "react";
import Modal from "react-modal";
import { useWallet } from "use-wallet";
import "./index.css";
import useSettings from "../../hooks/useSettings";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";
import makeStyles from "@mui/styles/makeStyles";

const styles = makeStyles((theme) => ({
  mybtn: {
    textDecoration: "none",
    fontSize: "18px !important",
    background: `linear-gradient(90deg, ${theme.palette.secondary.main} ,${theme.palette.primary.main})`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    fontWeight: `600 !important`,
    color: `#fff !important`,
    height: `64px`,
    border: `none`,
    borderRadius: `25px`,
    transition: `0.3s`,
    width: `100%`,
    cursor: `pointer`,
    "&:hover": {
      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    },
    "&:disabled": {
      background: `linear-gradient(90deg, #2a2a2a55 0%, #2a2a2a55 100%)`,
      color: "gray!important",
    },
  },
}));

const ConnectModal = ({ open, setOpen }) => {
  const wallet = useWallet();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.between("xs", "md"));
  const { settings, saveSettings } = useSettings();
  const classes = styles();

  const customStyles = {
    overlay: {
      backgroundColor: "#151935aa",
      zIndex: 999,
    },
    content: {
      backgroundColor: theme.palette.background.paper,
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      minWidth: 350,
      transform: "translate(-50%, -50%)",
      zIndex: 2,
      textAlign: "center",
    },
  };

  function connectWalletConnect() {
    setOpen(false);
    wallet.connect("walletconnect");
    saveSettings({
      ...settings,
      walletConnected: true,
      walletConnection: "walletconnect",
    });
  }

  function connectMeta() {
    setOpen(false);
    wallet.connect();
    saveSettings({
      ...settings,
      walletConnected: true,
      walletConnection: "",
    });
  }

  useEffect(() => {
    Modal.setAppElement("body");
  }, []);

  return (
    <Modal
      isOpen={open}
      onRequestClose={() => setOpen(false)}
      style={customStyles}
      contentLabel="Connect Modal"
    >
      <h2
        style={{
          fontSize: "1.2em",
          marginBottom: "1em",
          color: theme.palette.text.primary,
        }}
      >
        Choose Your Wallet
      </h2>
      <div>
        <Button
          className={classes.mybtn}
          onClick={connectMeta}
          style={{
            padding: 18,
          }}
        >
          <img
            src={"/images/metamask.png"}
            width={32}
            height={32}
            style={{ marginRight: 5 }}
          />
          Metamask
        </Button>
      </div>
      <div style={{ minHeight: 15 }} />
      {isMobile && (
        <div>
          <Button
            className={classes.mybtn}
            onClick={connectMeta}
            style={{
              padding: 18,
            }}
          >
            <img
              src={"/images/trust.png"}
              width={32}
              height={32}
              style={{ marginRight: 5 }}
            />
            Trust Wallet
          </Button>
        </div>
      )}
      {isMobile && <div style={{ minHeight: 15 }} />}
      <div>
        <Button className={classes.mybtn} onClick={connectWalletConnect}>
          <img
            src={"/images/walletConnect.png"}
            width={32}
            height={32}
            style={{ marginRight: 5 }}
          />
          Wallet Connect
        </Button>
      </div>
    </Modal>
  );
};

export default ConnectModal;
