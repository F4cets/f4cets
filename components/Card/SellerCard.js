import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { motion } from "framer-motion";
import classNames from "classnames"; // Import for classNames
import { whiteColor } from "/styles/jss/nextjs-material-kit-pro.js"; // Import for whiteColor (used in marketplaceStyle.js)
import Card from "./Card.js"; // Relative import from same folder
import CardBody from "./CardBody.js"; // Import CardBody to structure content
import CardHeader from "./CardHeader.js"; // Import CardHeader for image
import styles from "/styles/jss/nextjs-material-kit-pro/components/cardStyle.js";
import marketplaceStyles from "/styles/jss/nextjs-material-kit-pro/pages/marketplaceStyle.js";
import makeStyles from "@mui/styles/makeStyles"; // Added import for makeStyles
import Button from "/components/CustomButtons/Button.js"; // Import for Button

const useStyles = makeStyles({ ...styles, ...marketplaceStyles });

export default function SellerCard({ seller, className }) {
  const classes = useStyles();

  return (
    <motion.div
      initial={{ 
        rotate: 0, 
        scale: 1, // No initial scaling down for compact size
        opacity: 0, 
        y: 20 // Slight upward translation for entrance effect
      }}
      whileHover={{ 
        rotate: 4, // Even smaller rotation for minimal effect
        scale: 1.005, // Very subtle scale increase to maintain compactness
        boxShadow: "none" // No hover shadow to keep sleek
      }}
      whileInView={{ 
        rotate: 0, 
        scale: 1, // Reset to default scale for compactness
        opacity: 1, 
        y: 0 
      }}
      transition={{ 
        duration: 0.5, 
        ease: "anticipate" // Smoother, more dynamic easing for morphing
      }}
      className={classNames(className, classes.cardAnimated)} // Use classNames for dynamic classes
      style={{ 
        overflow: "hidden", 
        borderRadius: "8px", 
        position: "relative", 
        zIndex: 1, // Ensure each card has a higher z-index to prevent overlap
      }} // Ensure effects stay within bounds and manage layering
    >
      <Link href={`/seller/${seller.id}`} passHref>
        <a>
          <Card
            plain
            product
            className={classes.card}
          >
            <CardHeader
              image
              className={classNames(classes.cardHeader, classes.cardHeaderImageNoMargin)} // Add custom class for no margin
            >
              <div className={classes.cardHeaderImageContainer}> {/* Wrap image with padding container */}
                <img src={seller.image} alt={seller.name} />
              </div>
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>{seller.name}</h4>
              <p className={classes.description}>{seller.description}</p>
              <Button color="rose" round className={classes.button}>
                Visit Store
              </Button>
            </CardBody>
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
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
};