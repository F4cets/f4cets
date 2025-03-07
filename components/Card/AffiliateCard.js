import React from "react";
import { motion } from "framer-motion";
import Card from "../Card/Card.js";
import Button from "@mui/material/Button";
import makeStyles from "@mui/styles/makeStyles";
import styles from "/styles/jss/nextjs-material-kit-pro/pages/affiliateStyle.js"; // Use affiliateStyle.js

const useStyles = makeStyles(styles);

export default function AffiliateCard({ affiliate }) {
  const classes = useStyles();
  console.log("Rendering AffiliateCard:", affiliate);

  return (
    <motion.div
      initial={{ rotate: 0, scale: 0.9 }}
      whileHover={{ rotate: 10, scale: 1.1 }}
      whileInView={{ rotate: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        plain
        className={classes.card}
        image={affiliate.logourl}
        title={affiliate.name || "Unnamed Affiliate"}
        description={affiliate.cryptoBackOffer || "No Offer"}
        footer={
          <Button
            className={classes.button}
            href={affiliate.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            fullWidth
          >
            Visit Affiliate
          </Button>
        }
      />
    </motion.div>
  );
}