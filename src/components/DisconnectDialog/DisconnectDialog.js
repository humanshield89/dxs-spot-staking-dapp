import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useConnectWallet from "../../hooks/useConnectWallet";
import { useWallet } from "use-wallet";
import useTheme from "@mui/material/styles/useTheme";

export default function DisconnectDialog({ open, setOpen }) {
  const connectWallet = useConnectWallet();
  const wallet = useWallet();
  const theme = useTheme();
  const handleDisconnect = () => {
    setOpen(false);
    connectWallet.disconnect();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            background: theme.palette.background.paperOpaque,
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {"Disconnect Your Current Wallet?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Currently connect with: <code>{wallet.account}</code>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisconnect}>Disconnect</Button>
          <Button onClick={handleClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
