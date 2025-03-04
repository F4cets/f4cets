import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { motion } from "framer-motion";
import Card from "./Card.js"; // Relative import from same folder
import Button from "/components/CustomButtons/Button.js"; // Import Button component
import styles from "/styles/jss/nextjs-material-kit-pro/components/cardStyle.js";
import marketplaceStyles from "/styles/jss/nextjs-material-kit-pro/pages/marketplaceStyle.js";
import makeStyles from "@mui/styles/makeStyles"; // Ensure correct import

const useStyles = makeStyles({ ...styles, ...marketplaceStyles });

export default function SellerCard({ seller, className }) {
  const classes = useStyles();

  return (
    <motion.div
      initial={{ rotate: 0, scale: 0.9 }}
      whileHover={{ rotate: 10, scale: 1.1 }}
      whileInView={{ rotate: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Link href={`/seller/${seller.id}`} passHref>
        <a>
          <Card
            plain
            product
            className={classes.card}
            image={`/img/examples/${seller.image}`} // Corrected path for images
            title={seller.name}
            description={seller.description}
          >
            <Button color="rose" round className={classes.button}>
              Visit Store
            </Button>
          </Card>
        </a>
      </Link>
    </motion.div>
  );
}

SellerCard.propTypes = {
  seller: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired, // e.g., "seller1.jpg"
    description: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
};