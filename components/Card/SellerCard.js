import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { motion } from "framer-motion";
import Card from "./Card.js"; // Relative import from same folder
import CardHeader from "./CardHeader.js"; // Import stock CardHeader
import CardBody from "./CardBody.js"; // Import stock CardBody
import CardFooter from "./CardFooter.js"; // Import stock CardFooter
import Button from "/components/CustomButtons/Button.js"; // Import Button component
import styles from "/styles/jss/nextjs-material-kit-pro/components/cardStyle.js";
import marketplaceStyles from "/styles/jss/nextjs-material-kit-pro/pages/marketplaceStyle.js";
import makeStyles from "@mui/styles/makeStyles"; // Ensure correct import
import classNames from "classnames"; // Ensure correct import

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
            className={classNames(classes.card, classes.cardContent)} // Ensure cardContent is applied
          >
            <CardHeader image>
              <img
                src={`/img/examples/${seller.image}`} // Direct image rendering
                alt={seller.name}
                className={classes.cardImage}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>{seller.name}</h4>
              <p className={classes.description}>{seller.description}</p>
            </CardBody>
            <CardFooter className={classes.cardFooter}>
              <Button color="rose" round className={classes.button}>
                Visit Store
              </Button>
            </CardFooter>
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