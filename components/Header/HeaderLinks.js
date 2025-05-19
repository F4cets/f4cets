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
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Material-UI icons
import Storefront from "@mui/icons-material/Storefront";
import Group from "@mui/icons-material/Group";
import AccountCircle from "@mui/icons-material/AccountCircle";
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
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <List className={classes.list + " " + classes.mlAuto}>
      <ListItem className={classes.listItem}>
        <Link href="/marketplace">
          <Button color="transparent" className={classes.navButton}>
            <Storefront className={classes.icons} /> Marketplace
          </Button>
        </Link>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Link href="/affiliate">
          <Button color="transparent" className={classes.navButton}>
            <Group className={classes.icons} /> Affiliate
          </Button>
        </Link>
      </ListItem>
      {user && user.isActive && (
        <ListItem className={classes.listItem}>
          {isLgUp && (
            <Button
              href="/shopping-cart"
              color="white"
              className={classes.navButton}
              round
            >
              <ShoppingCart className={classes.icons} /> Cart
            </Button>
          )}
          {isMdDown && (
            <Button
              href="/shopping-cart"
              color="rose"
              className={classes.navButton}
              round
            >
              <ShoppingCart className={classes.icons} /> Cart
            </Button>
          )}
        </ListItem>
      )}
      {user && user.isActive && (
        <ListItem className={classes.listItem}>
          <Button
            href={`https://user.f4cets.market/${user.role}/${user.walletId}`}
            color="white"
            className={classes.navButton}
            round
          >
            <AccountCircle className={classes.icons} /> Account
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