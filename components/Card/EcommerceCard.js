import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Card from "./Card.js";
import CardHeader from "./CardHeader.js";
import CardBody from "./CardBody.js";
import styles from "/styles/jss/nextjs-material-kit-pro/components/cardStyle.js";
import ecommerceStyles from "/styles/jss/nextjs-material-kit-pro/pages/ecommerceSections/productsStyle.js";
import makeStyles from "@mui/styles/makeStyles";
import classNames from "classnames";

const useStyles = makeStyles({
  ...styles,
  ...ecommerceStyles,
  card: {
    overflow: 'visible',
    maxWidth: '300px',
    margin: '0 auto 50px auto',
    height: 'auto',
  },
  cardBody: {
    padding: '8px',
  },
  priceContainer: {
    marginBottom: '4px',
    textAlign: 'center',
    fontFamily: '"Quicksand", sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    color: '#555',
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: '4px',
    fontFamily: '"Quicksand", sans-serif',
    fontSize: '16px',
    fontWeight: 500,
    color: '#333',
  },
  description: {
    textAlign: 'center',
    marginBottom: '4px',
    fontFamily: '"Quicksand", sans-serif',
    fontSize: '12px',
    fontWeight: 400,
    color: '#777',
  },
});

export default function EcommerceCard({ item, className }) {
  const classes = useStyles();
  const { flash } = item;

  return (
    <motion.div
      initial={{ rotate: 0, scale: 0.9 }}
      whileHover={{
        rotate: 5,
        scale: [1.1, 1.05, 1.1],
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
        <a style={{ textDecoration: 'none' }}>
          <Card plain product className={classNames(classes.card, classes.cardContent)}>
            <CardHeader image>
              <img
                src={item.imageUrl}
                alt={item.name}
                className={classes.cardImage}
              />
            </CardHeader>
            <CardBody className={classes.cardBody}>
              <h4 className={classes.cardTitle}>{item.name}</h4>
              <p className={classes.description}>
                {item.inventory > 0 ? `${item.inventory} in stock` : "Out of stock"}
              </p>
              <Box
                className={classes.priceContainer}
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap="12px"
              >
                <span className={classes.price}>
                  ${item.priceUsdc.toLocaleString()} USDC
                </span>
                <motion.span
                  animate={flash ? { scale: [1, 1.3, 1], color: ['#555', '#6fcba9', '#555'] } : {}}
                  transition={{ duration: 0.8 }}
                  style={{ color: '#555' }}
                >
                  ({item.priceSol} SOL)
                </motion.span>
              </Box>
            </CardBody>
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
    priceUsdc: PropTypes.number.isRequired,
    priceSol: PropTypes.number.isRequired,
    inventory: PropTypes.number.isRequired,
    category: PropTypes.string,
    type: PropTypes.string,
    flash: PropTypes.bool.isRequired,
  }).isRequired,
  className: PropTypes.string,
};