import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import useTheme from "@mui/system/useTheme";

export default function ConfirmDialog({ open, setOpen, callBack }) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      PaperProps={{
        style: {
          background: theme.palette.background.paperOpaque,
        },
      }}
    >
      <DialogTitle style={{ backgroundColor: theme.palette.error.main }}>
        <Typography variant={"h5"}>Emergency withdraw</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant={"subtitle1"} style={{ marginTop: 8 }}>
            Emergency withdraw is an extreme function in case of farm critical
            errors and calling it will withdraw your staked token but it will
            <b> forfeit your pending rewards</b>. All your staked amounts will
            be withdrawn even the locked stakes (No Penalty will be applied)
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={callBack} style={{ color: theme.palette.error.main }}>
          Yes forfeit My Rewards
        </Button>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export function DisclaimerDialog({ open, setOpen, callBack }) {
  const theme = useTheme();
  return (
    <Dialog open={open}>
      <DialogContent
        style={{ backgroundColor: theme.palette.background.paperOpaque }}
      >
        <DialogContentText>
          <Box severity={"info"} style={{ padding: 16 }}>
            <ol style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Typography variant={"h3"} color={"primary"}>
                DX Spot Staking Disclaimer
              </Typography>
              <Typography variant={"subtitle1"}>
                Staking your LP tokens in the staking pool implies that you have
                understood the following:
              </Typography>
              <br />
              <li>
                The APY is self adjusting. This means that the more or less
                people that get into the staking pool, the APY will
                automatically update accordingly.
              </li>
              <li>
                There's a lock in period for staking, This means you can not
                have access to your LP tokens by any mean until the lock
                expires.
              </li>
              <li>
                You can manually harvest your generated rewards but also note
                that by staking/unstaking your DXS tokens rewards will
                automatically be claimed for you.
              </li>
              <li>
                Once your tokens are unlocked, no fee will be charged to unstake
                your tokens.
              </li>
              <li>
                Even after the lock period is over, your DXS tokens will
                continue to generate rewards from staking.
              </li>
            </ol>
            <br />
            <p style={{ width: "100%", textAlign: "right", marginTop: 12 }}>
              Regards, DXS Team
            </p>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions
        style={{ backgroundColor: theme.palette.background.paperOpaque }}
      >
        <Button onClick={callBack} style={{ color: "#15C39A" }}>
          I Understand
        </Button>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
