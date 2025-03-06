import React from "react";
import { motion } from "framer-motion";
import Card from "../Card/Card.js";
import CardActionArea from "@mui/material/CardActionArea"; // For making the card clickable
import makeStyles from "@mui/styles/makeStyles";
import styles from "/styles/jss/nextjs-material-kit-pro/components/cardStyle.js";

const useStyles = makeStyles(styles);

export default function AffiliateCard({ affiliate }) {
  const classes = useStyles();

  return (
    <motion.div
      initial={{ rotate: 0, scale: 0.9 }}
      whileHover={{ rotate: 10, scale: 1.1 }}
      whileInView={{ rotate: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CardActionArea href={affiliate.affiliateLink} target="_blank" rel="noopener noreferrer">
        <Card
          plain
          className={classes.card}
          image={affiliate.logoUrl} // Use logoUrl instead of image
          title={affiliate.name}
          description={affiliate.cryptoBackOffer} // Use cryptoBackOffer instead of description
          footer={<small className={classes.cardFooter}>Use our link for rewards (cookies enabled)</small>}
        />
      </CardActionArea>
    </motion.div>
  );
}