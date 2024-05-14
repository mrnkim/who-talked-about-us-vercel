import { React } from "react";
import WarningIcon from "../svg/Warning.svg";
import "./ErrorFallback.css";

/** Component to show when there is an error */
function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <p>Something went wrong</p>
      <div className="warningMessageWrapper">
        <img src={WarningIcon} alt="WarningIcon" className="icon"></img>
        <div className="warningMessage">{error?.message || error.error}</div>
      </div>
    </div>
  );
}

export default ErrorFallback;
