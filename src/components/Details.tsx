import { Link, makeStyles, shorthands } from "@fluentui/react-components";
import { useCallback } from "react";

const useStyles = makeStyles({
  iframe: {
    ...shorthands.border("none"),
    width: "100%",
    minWidth: "250px",
    maxWidth: "300px",
    height: "500px",
    display: "block",
    "@media (max-width: 800px) and (min-width: 651px)": {
      height: "450px",
    },
    "@media (max-width: 650px) and (min-width: 381px)": {
      height: "400px",
    },
    "@media (max-width: 380px)": {
      height: "450px",
    },
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
          <p>Saturday, October 3rd, 2026</p>
        </div>
        <div className="detail">
          <h3>Start Time</h3>
          <p>7:30am MDT</p>
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
        <div className="detail">
          <h3>The Course</h3>
          <div
            className="strava-embed-placeholder"
            data-embed-type="route"
            data-embed-id="3495235925911606222"
            data-full-width="true"
            data-hide-elevation="true"
          ></div>
          <script src="https://strava-embeds.com/embed.js"></script>
          <iframe
            title="2026 - TB50K The Loco Strikes Back"
            className={classes.iframe}
            src="https://strava-embeds.com/route/3495235925911606222?fullWidth=true&hideElevation=true#hostOrigin=https%3A%2F%2Fwww.strava.com&hostPath=%2Froutes%2F3495235925911606222&hostTitle=2026+-+TB50K+The+Loco+Strikes+Back+%7C+Running+Route+on+Strava"
          ></iframe>
        </div>
      </div>
    </section>
  );
};
