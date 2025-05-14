import React from "react";
import { motion } from "framer-motion";
import Card from "../Card/Card.js";
import makeStyles from "@mui/styles/makeStyles";
import styles from "/styles/jss/nextjs-material-kit-pro/pages/affiliateStyle.js";

const useStyles = makeStyles(styles);

export default function AffiliateCard({ affiliate, onClick }) {
  const classes = useStyles();
  console.log("Rendering AffiliateCard with logoUrl:", affiliate.logoUrl);

  const imageSrc = affiliate.logoUrl && affiliate.logoUrl !== ""
    ? affiliate.logoUrl
    : "https://picsum.photos/300/150";

  const handleClick = () => {
    if (onClick) {
      onClick(affiliate); // Call the tracking function
    }
  };

  return (
    <motion.div
      initial={{ rotate: 0, scale: 0.9 }}
      whileHover={{ rotate: 10, scale: 1.1 }}
      whileInView={{ rotate: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <a
        href={affiliate.affiliateLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
        onClick={handleClick}
      >
        <Card plain className={classes.card}>
          <img
            src={imageSrc}
            alt={affiliate.name || "Affiliate"}
            className={classes.cardImage}
            onError={(e) => {
              e.target.src = "https://picsum.photos/300/150";
              console.log("Image load failed, using fallback");
            }}
          />
          <h4 className={classes.cardTitle}>{affiliate.name || "Unnamed Affiliate"}</h4>
          <p className={classes.description}>{affiliate.cryptoBackOffer || "No Offer"}</p>
        </Card>
      </a>
    </motion.div>
  );
}