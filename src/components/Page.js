import React, { forwardRef, useCallback, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

const Page = forwardRef(({ children, title = "", ...rest }, ref) => {
  const sendPageViewEvent = useCallback(() => {
    // TODO Parse analytics add this page view
  }, []);

  useEffect(() => {
    sendPageViewEvent();
  }, [sendPageViewEvent]);

  return (
    <HelmetProvider>
      <Box ref={ref} {...rest} style={{ width: "100%" }}>
        <Helmet>
          <title>{"DX Spot - " + title}</title>
        </Helmet>
        {children}
      </Box>
    </HelmetProvider>
  );
});

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export default Page;
