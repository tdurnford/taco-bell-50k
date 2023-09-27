import { makeStyles, shorthands } from "@fluentui/react-components";

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

export const RaceDetails = () => {
  const classes = useStyles();
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
          <p>447 S Broadway</p>
          <p>Denver, CO 80209</p>
        </div>
        <div className="detail">
          <h3>The Course</h3>
          <iframe
            title="TB50k2023 | 31.5 mi Running Route on Strava"
            className={classes.iframe}
            src="https://strava-embeds.com/route/3141754116069360858?fullWidth=true&hideElevation=true#ns=c94bd402-be4b-472d-b08b-f30264d430cb&hostOrigin=https%3A%2F%2Fwww.strava.com&hostPath=%2Froutes%2F3141754116069360858&hostTitle=TB50k2023+%7C+31.5+mi+Running+Route+on+Strava"
          ></iframe>
        </div>
      </div>
    </section>
  );
};
