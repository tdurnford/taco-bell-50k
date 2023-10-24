import { useEffect, useState } from "react";
import { DateTime, Interval } from "luxon";
import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

const start = DateTime.local(2024, 10, 5, 7, 0, 0, { zone: "America/Denver" });

const leadingZero = (value: number) => {
  return value < 10 ? `0${value}` : value;
};

const useStyles = makeStyles({
  content: {
    maxWidth: "400px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexGrow: 1,
  },
  countdown: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    fontSize: "24px",
    fontWeight: "bold",
    lineHeight: "1.2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ...shorthands.padding("20px"),
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  label: {
    fontSize: "14px",
    fontWeight: "normal",
    lineHeight: "1.2",
  },
});

export const Countdown = () => {
  const classes = useStyles();
  const [now, setNow] = useState(DateTime.now());

  const interval = Interval.fromDateTimes(now, now < start ? start : now);

  const days = interval.length("days");
  const hours = interval.length("hours") % 24;
  const minutes = interval.length("minutes") % 60;
  const seconds = interval.length("seconds") % 60;

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(DateTime.now());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={classes.countdown}>
      <div className={classes.content}>
        <div className={classes.item}>
          <div className="countdown-value">{leadingZero(Math.floor(days))}</div>
          <div className={classes.label}>Days</div>
        </div>
        <div className={classes.item}>
          <div className="countdown-value">
            {leadingZero(Math.floor(hours))}
          </div>
          <div className={classes.label}>Hrs</div>
        </div>
        <div className={classes.item}>
          <div className="countdown-value">
            {leadingZero(Math.floor(minutes))}
          </div>
          <div className={classes.label}>Mins</div>
        </div>
        <div className={classes.item}>
          <div className="countdown-value">
            {leadingZero(Math.floor(seconds))}
          </div>
          <div className={classes.label}>Secs</div>
        </div>
      </div>
    </div>
  );
};
