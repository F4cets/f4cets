import React from "react";
import { motion } from "framer-motion";
import Card from "../Card/Card.js";
import makeStyles from '@mui/styles/makeStyles'; // Add missing import
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
      <Card
        plain
        className={classes.card}
        image={affiliate.image}
        title={affiliate.name}
        description={`Earn ${affiliate.cashbackRate} WNDO Cashback`}
        buttonText={<a href={affiliate.link} target="_blank" rel="noopener noreferrer">Shop Now</a>}
        footer={<small className={classes.cardFooter}>Use our link for rewards (cookies enabled)</small>}
      />
    </motion.div>
  );
}