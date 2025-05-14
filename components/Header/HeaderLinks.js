/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import dynamic from "next/dynamic";

// Solana Wallet Adapter imports
import { useUser } from "/contexts/UserContext";

// Material-UI imports
import makeStyles from "@mui/styles/makeStyles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Icon from "@mui/material/Icon";
import Hidden from "@mui/material/Hidden";

// Material-UI icons
import ShoppingCart from "@mui/icons-material/ShoppingCart";

// Core components
import Button from "/components/CustomButtons/Button.js";

// Styles
import styles from "/styles/jss/nextjs-material-kit-pro/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

// Dynamic import for WalletMultiButton
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

export default function HeaderLinks(props) {
  const { dropdownHoverColor } = props;
  const classes = useStyles();
  const { user } = useUser();

  return (
    <List className={classes.list + " " + classes.mlAuto}>
      <ListItem className={classes.listItem}>
        <Link href="/marketplace">
          <a className={classes.navLink}>
            <Icon className={classes.icons}>store</Icon> Marketplace
          </a>
        </Link>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Link href="/affiliate">
          <a className={classes.navLink}>
            <Icon className={classes.icons}>group</Icon> Affiliate
          </a>
        </Link>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Hidden lgDown>
          <Button
            href="/shopping-cart"
            color="white"
            className={classes.navButton}
            round
          >
            <ShoppingCart className={classes.icons} /> Cart
          </Button>
        </Hidden>
        <Hidden mdUp>
          <Button
            href="/shopping-cart"
            color="rose"
            className={classes.navButton}
            round
          >
            <ShoppingCart className={classes.icons} /> Cart
          </Button>
        </Hidden>
      </ListItem>
      {user && (
        <ListItem className={classes.listItem}>
          <Button
            href={`https://user.f4cets.market/${user.role}/${user.walletId}`}
            color="white"
            className={classes.navButton}
            round
          >
            <Icon className={classes.icons}>account_circle</Icon> Account
          </Button>
        </ListItem>
      )}
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