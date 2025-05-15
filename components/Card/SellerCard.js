import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { motion } from "framer-motion";
import Card from "./Card.js";
import makeStyles from "@mui/styles/makeStyles";
import styles from "/styles/jss/nextjs-material-kit-pro/pages/affiliateStyle.js";
import classNames from "classnames";

const useStyles = makeStyles(styles);

export default function SellerCard({ seller, className }) {
  const classes = useStyles();

  // Determine image source
  const imageSrc = seller.image && seller.image !== ""
    ? seller.image
    : "https://picsum.photos/600/300";

  return (
    <motion.div
      initial={{ rotate: 0, scale: 0.9 }}
      whileHover={{ rotate: 10, scale: 1.1 }}
      whileInView={{ rotate: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Link href={seller.type === "store" ? `/sellers/${seller.id}` : `/products/${seller.id}`} passHref>
        <a style={{ textDecoration: "none" }}>
          <Card plain className={classNames(classes.card, classes.cardContent)}>
            <img
              src={imageSrc}
              alt={seller.name || "Item"}
              className={classes.cardImage}
              style={{ aspectRatio: "2/1", objectFit: "cover" }}
              onError={(e) => {
                e.target.src = "https://picsum.photos/600/300";
                console.log("Image load failed, using fallback");
              }}
            />
            <h4 className={classes.cardTitle}>{seller.name || "Unnamed Item"}</h4>
            <p className={classes.description}>
              {seller.description || "No description available"}
            </p>
            {seller.type === "product" && (
              <p className={classes.description}>
                {seller.price ? `${seller.price} USDC` : "Price not available"}
              </p>
            )}
          </Card>
        </a>
      </Link>
    </motion.div>
  );
}

SellerCard.propTypes = {
  seller: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.oneOf(["store", "product"]).isRequired,
    price: PropTypes.number,
  }).isRequired,
  className: PropTypes.string,
};