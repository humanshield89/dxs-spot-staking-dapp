import React from "react";
import { createBrowserHistory } from "history";
import { create } from "jss";
import rtl from "jss-rtl";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { jssPreset, StylesProvider } from "@mui/styles";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import GlobalStyles from "./components/GlobalStyles";
import useSettings from "./hooks/useSettings";
import { createTheme } from "./theme";
import routes, { renderRoutes } from "./routes";
import { HashRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { ConnectWalletProvider } from "./contexts/ConnectWalletContext";
import { UseWalletProvider } from "use-wallet";
import { DXSProvider } from "./contexts/DXSContext";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const history = createBrowserHistory();

const App = () => {
  const { settings } = useSettings();

  const theme = createTheme({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    theme: settings.theme,
  });

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <StylesProvider jss={jss}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <SnackbarProvider
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              dense
              maxSnack={3}
            >
              <UseWalletProvider
                chainId={process.env.CHAIN_ID}
                connectors={{
                  walletconnect: {
                    rpc: {
                      56: "https://bsc-dataseed.binance.org/",
                    },
                  },
                }}
                pollBalanceInterval={2000}
                pollBlockNumberInterval={5000}
              >
                <ConnectWalletProvider>
                  <DXSProvider>
                    <HashRouter history={history}>
                      <GlobalStyles />
                      {renderRoutes(routes)}
                    </HashRouter>
                  </DXSProvider>
                </ConnectWalletProvider>
              </UseWalletProvider>
            </SnackbarProvider>
          </LocalizationProvider>
        </StylesProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
export default App;
