/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import dynamic from "next/dynamic"; // Add dynamic import

// Solana Wallet Adapter imports
import { useWallet } from '@solana/wallet-adapter-react';
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false } // Disable SSR for this component
);

import makeStyles from "@mui/styles/makeStyles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Icon from "@mui/material/Icon";
import Hidden from "@mui/material/Hidden";

// @mui/icons-material
import ShoppingCart from "@mui/icons-material/ShoppingCart";

// core components
import Button from "/components/CustomButtons/Button.js";

import styles from "/styles/jss/nextjs-material-kit-pro/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const smoothScroll = (e, target) => {
    if (window.location.pathname === "/sections") {
      var isMobile = navigator.userAgent.match(
        /(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i
      );
      if (isMobile) {
        // if we are on mobile device the scroll into view will be managed by the browser
      } else {
        e.preventDefault();
        var targetScroll = document.getElementById(target);
        scrollGo(document.documentElement, targetScroll.offsetTop, 1250);
      }
    }
  };
  const scrollGo = (element, to, duration) => {
    var start = element.scrollTop,
      change = to - start,
      currentTime = 0,
      increment = 20;

    var animateScroll = function () {
      currentTime += increment;
      var val = easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  };
  var onClickSections = {};

  const { dropdownHoverColor } = props;
  const classes = useStyles();
  return (
    <List className={classes.list + " " + classes.mlAuto}>
      {/* Marketplace Link */}
      <ListItem className={classes.listItem}>
        <Link href="/marketplace">
          <a className={classes.navLink}>
            <Icon className={classes.icons}>store</Icon> Marketplace
          </a>
        </Link>
      </ListItem>
      {/* Affiliate Link */}
      <ListItem className={classes.listItem}>
        <Link href="/affiliate">
          <a className={classes.navLink}>
            <Icon className={classes.icons}>group</Icon> Affiliate
          </a>
        </Link>
      </ListItem>
      {/* Cart Button */}
      <ListItem className={classes.listItem}>
        <Hidden lgDown>
          <Button
            href="https://www.creative-tim.com/product/nextjs-material-kit-pro?ref=njsmkp-navbar"
            color={"white"}
            target="_blank"
            className={classes.navButton}
            round
          >
            <ShoppingCart className={classes.icons} /> Cart
          </Button>
        </Hidden>
        <Hidden mdUp>
          <Button
            href="https://www.creative-tim.com/product/nextjs-material-kit-pro?ref=njsmkp-navbar"
            color={"info"}
            target="_blank"
            className={classes.navButton}
            round
          >
            <ShoppingCart className={classes.icons} /> Cart
          </Button>
        </Hidden>
      </ListItem>
      {/* Solana Wallet Button - Visible on all screen sizes */}
      <ListItem className={classes.listItem}>
        <WalletMultiButton className={classes.navButton} />
      </ListItem>
    </List>
  );
}

HeaderLinks.defaultProps = {
  hoverColor: "primary",
};

HeaderLinks.propTypes = {
  dropdownHoverColor: PropTypes.oneOf([
    "dark",
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "rose",
  ]),
};