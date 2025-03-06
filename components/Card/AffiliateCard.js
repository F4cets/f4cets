import React from "react";
import Card from "../Card/Card.js";
import CardActionArea from "@mui/material/CardActionArea";
import makeStyles from "@mui/styles/makeStyles";
import styles from "/styles/jss/nextjs-material-kit-pro/rotatingCards.js";

const useStyles = makeStyles(styles);

export default function AffiliateCard({ affiliate }) {
  const classes = useStyles();

  return (
    <div className={classes.card}>
      <div className={classes.cardItem}>
        <CardActionArea href={affiliate.affiliateLink} target="_blank" rel="noopener noreferrer">
          <div className={classes.front}>
            <Card
              plain
              className={classes.card}
              image={affiliate.logoUrl}
              title={affiliate.name}
            />
          </div>
          <div className={classes.back}>
            <Card
              plain
              className={classes.card}
              description={affiliate.cryptoBackOffer}
              footer={<small className={classes.cardFooter}>Use our link for rewards (cookies enabled)</small>}
            />
          </div>
        </CardActionArea>
      </div>
    </div>
  );
}