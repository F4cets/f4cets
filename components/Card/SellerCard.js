import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { motion } from "framer-motion";
import classNames from "classnames"; // Import for classNames
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
        scale: 0.9, 
        opacity: 0, 
        y: 20 // Slight upward translation for entrance effect
      }}
      whileHover={{ 
        rotate: 10, 
        scale: 1.05, // Reduced scale to minimize ghosting
        boxShadow: "0 8px 12px -4px rgba(0, 0, 0, 0.1)" // Further reduced shadow intensity and spread
      }}
      whileInView={{ 
        rotate: 0, 
        scale: 1, 
        opacity: 1, 
        y: 0 
      }}
      transition={{ 
        duration: 0.5, 
        ease: "anticipate" // Smoother, more dynamic easing for morphing
      }}
      className={classNames(className, classes.cardAnimated)} // Use classNames for dynamic classes
      style={{ overflow: "hidden", borderRadius: "8px" }} // Ensure shadow stays within bounds and matches card radius
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