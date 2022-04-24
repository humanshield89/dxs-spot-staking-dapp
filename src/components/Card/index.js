import styled from "@mui/styles/styled";
import Paper from "@mui/material/Paper";

export const CustomCard = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.main,
  border:
    theme.palette.mode == "light"
      ? "none"
      : `1px solid ${theme.palette.secondary.main}55`,
}));
