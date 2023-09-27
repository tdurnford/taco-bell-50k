import { Link, makeStyles, shorthands } from "@fluentui/react-components";
import { useCallback } from "react";

const useStyles = makeStyles({
  iframe: {
    ...shorthands.border("none"),
    width: "100%",
    minWidth: "250px",
    maxWidth: "100%",
    height: "500px",
    display: "block",
  },
});

const address = "447 S Broadway, Denver, CO 80209";

export const RaceDetails = () => {
  const classes = useStyles();

  const handleClick = useCallback(() => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
    const appleMapsUrl = `http://maps.apple.com/?q=${encodeURIComponent(
      address
    )}`;

    const isAppleDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    window.open(
      isAppleDevice ? appleMapsUrl : googleMapsUrl,
      "_blank",
      "noopener noreferrer"
    );
  }, []);

  return (
    <section className="race-details">
      <h2>Race Details</h2>
      <div className="details-container">
        <div className="detail">
          <h3>Date</h3>
          <p>Saturday, October 14, 2023</p>
        </div>
        <div className="detail">
          <h3>Start Time</h3>
          <p>7:00 am MDT</p>
        </div>
        <div className="detail">
          <h3>Location</h3>
          <Link as="button" onClick={handleClick}>
            <p>
              447 S Broadway
              <br />
              Denver, CO 80209
            </p>
          </Link>
        </div>
        {/* <div className="detail">
          <h3>The Course</h3>
          <iframe
            title="TB50k2023 | 31.5 mi Running Route on Strava"
            className={classes.iframe}
            src="https://strava-embeds.com/route/3141754116069360858?fullWidth=true&hideElevation=true#ns=c94bd402-be4b-472d-b08b-f30264d430cb&hostOrigin=https%3A%2F%2Fwww.strava.com&hostPath=%2Froutes%2F3141754116069360858&hostTitle=TB50k2023+%7C+31.5+mi+Running+Route+on+Strava"
          ></iframe>
        </div> */}
      </div>
    </section>
  );
};
