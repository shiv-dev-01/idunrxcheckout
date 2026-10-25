import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  captureImpactClickId,
  identifyImpactUser,
} from "../utils/impactCom";

/**
 * Runs impact.com identify + click-id capture on every route.
 * Mount once inside BrowserRouter (see App.js).
 */
const ImpactTracking = () => {
  const location = useLocation();

  useEffect(() => {
    captureImpactClickId();
    identifyImpactUser();
  }, [location.pathname, location.search]);

  return null;
};

export default ImpactTracking;
