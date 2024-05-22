import { React } from "react";
import WarningIcon from "../svg/Warning.svg";
import "./ErrorFallback.css";

/** Component to show when there is an error */
function ErrorFallback({ error }) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div role="alert">
      <p>Something went wrong</p>
      <div className="warningMessageWrapper">
        <img src={WarningIcon} alt="WarningIcon" className="icon"></img>
        <div className="warningMessage">{error?.message || error.error}</div>
      </div>
      <button className="resetButton" onClick={handleRefresh}>
        Back to Home
      </button>
    </div>
  );
}

export default ErrorFallback;
