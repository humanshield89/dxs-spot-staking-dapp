import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// This component makes sure the scroll is back to top when location changes
const useScrollReset = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

export default useScrollReset;
