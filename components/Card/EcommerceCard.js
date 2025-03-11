import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { motion } from "framer-motion";
import Card from "./Card.js"; // Relative import from same folder
import CardHeader from "./CardHeader.js"; // Stock CardHeader
import CardBody from "./CardBody.js"; // Stock CardBody
import CardFooter from "./CardFooter.js"; // Stock CardFooter
import Button from "/components/CustomButtons/Button.js";
import styles from "/styles/jss/nextjs-material-kit-pro/components/cardStyle.js";
import ecommerceStyles from "/styles/jss/nextjs-material-kit-pro/pages/ecommerceSections/productsStyle.js"; // Use existing styles
import makeStyles from "@mui/styles/makeStyles";
import classNames from "classnames";

const useStyles = makeStyles({ ...styles, ...ecommerceStyles });

export default function EcommerceCard({ item, className }) {
  const classes = useStyles();

  return (
    <motion.div
      initial={{ rotate: 0, scale: 0.9 }}
      whileHover={{
        rotate: 5,
        scale: [1.1, 1.05, 1.1], // Pulse effect matching SellerCard
        transition: {
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        },
      }}
      whileInView={{ rotate: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Link href={`/products/${item.id}`} passHref>
        <a>
          <Card plain product className={classNames(classes.card, classes.cardContent)}>
            <CardHeader image>
              <img
                src={item.imageUrl}
                alt={item.name}
                className={classes.cardImage}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>{item.name}</h4>
              <p className={classes.description}>
                {item.inventory > 0 ? `${item.inventory} in stock` : "Out of stock"}
              </p>
            </CardBody>
            <CardFooter className={classes.cardFooter}>
              <Button color="rose" round className={classes.button}>
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        </a>
      </Link>
    </motion.div>
  );
}

EcommerceCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    priceSol: PropTypes.number.isRequired,
    priceWndo: PropTypes.number.isRequired,
    inventory: PropTypes.number.isRequired,
  }).isRequired,
  className: PropTypes.string,
};