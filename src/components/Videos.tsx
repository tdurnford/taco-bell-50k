import { FC } from "react";
import {
  Card,
  CardHeader,
  CardPreview,
  makeStyles,
  Text,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  card: {
    maxWidth: "400px",
    flexGrow: 1,
  },
  container: {
    columnGap: "16px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    rowGap: "16px",
  },
});

export const Videos: FC = () => {
  const classes = useStyles();

  return (
    <div>
      <h2>Historical archives</h2>
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardPreview>
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              frameBorder="0"
              height="315"
              src="https://www.youtube.com/embed/1g_8PJrugkA?si=sNKP6D28Wrdl2hzF"
              title="YouTube video player"
              width="560"
            ></iframe>
          </CardPreview>

          <CardHeader
            header={
              <Text weight="semibold">INTERNATIONAL TACO BELL 50k 2019</Text>
            }
          />
        </Card>
        <Card className={classes.card}>
          <CardPreview>
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              frameBorder="0"
              height="315"
              src="https://www.youtube.com/embed/XIIw9lEReoo?si=V7uS8KlfmM7nr7u8"
              title="YouTube video player"
              width="560"
            ></iframe>
          </CardPreview>

          <CardHeader
            header={
              <Text weight="semibold">
                2022 TACO BELL INTERNATIONAL 50K DEUCE WEEKEND
              </Text>
            }
          />
        </Card>
      </div>
    </div>
  );
};
