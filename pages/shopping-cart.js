/*eslint-disable*/
import React, { useState, useEffect } from "react";
import classNames from "classnames";
import makeStyles from '@mui/styles/makeStyles';
import Tooltip from "@mui/material/Tooltip";
import Favorite from "@mui/icons-material/Favorite";
import Close from "@mui/icons-material/Close";
import Remove from "@mui/icons-material/Remove";
import Add from "@mui/icons-material/Add";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Header from "/components/Header/Header.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import Parallax from "/components/Parallax/Parallax.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Table from "/components/Table/Table.js";
import Button from "/components/CustomButtons/Button.js";
import Card from "/components/Card/Card.js";
import CardBody from "/components/Card/CardBody.js";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import shoppingCartStyle from "/styles/jss/nextjs-material-kit-pro/pages/shoppingCartStyle.js";

const useStyles = makeStyles(shoppingCartStyle);

export default function ShoppingCartPage() {
  const classes = useStyles();
  const { connected, publicKey } = useWallet();
  const [walletId, setWalletId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isConnected, setIsConnected] = useState(null); // Null until client-side check

  // Track wallet ID and connection status client-side
  useEffect(() => {
    setIsConnected(connected);
    if (connected && publicKey) {
      const walletAddress = publicKey.toBase58();
      setWalletId(walletAddress);
      console.log("Wallet ID:", walletAddress);
    } else {
      setWalletId(null);
    }
  }, [connected, publicKey]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  // Placeholder cart data
  useEffect(() => {
    if (isConnected) {
      const sampleCart = [
        {
          id: "1",
          image: "/img/examples/dogbed.jpg",
          name: "Dog Bed",
          seller: "Sample Seller Store",
          color: "Blue",
          size: "M",
          priceSol: 10,
          quantity: 1,
          nftTokenId: "NFT_DOGBED_001"
        },
        {
          id: "2",
          image: "/img/examples/vase.jpg",
          name: "Vase",
          seller: "Sample Seller Store",
          color: "White",
          size: "L",
          priceSol: 15,
          quantity: 2,
          nftTokenId: "NFT_VASE_001"
        }
      ];
      setCartItems(sampleCart);
    }
  }, [isConnected]);

  const handleQuantityChange = (itemId, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.priceSol * item.quantity,
    0
  );

  // Desktop table data
  const tableData = cartItems.map((item) => [
    <div className={classes.imgContainer} key={item.id}>
      <img src={item.image} alt={item.name} className={classes.img} />
    </div>,
    <span key={item.id}>
      <a href={`/products/${item.id}`} className={classes.tdNameAnchor}>
        {item.name}
      </a>
      <br />
      <small className={classes.tdNameSmall}>by {item.seller}</small>
    </span>,
    item.color,
    item.size,
    <span key={item.id}>
      <small className={classes.tdNumberSmall}>SOL</small> {item.priceSol}
    </span>,
    <span key={item.id}>
      <div className={classes.buttonGroup}>
        <Button
          color="rose"
          size="sm"
          round
          onClick={() => handleQuantityChange(item.id, -1)}
        >
          <Remove />
        </Button>
        <span className={classes.quantityNumber}>{item.quantity}</span>
        <Button
          color="rose"
          size="sm"
          round
          onClick={() => handleQuantityChange(item.id, 1)}
        >
          <Add />
        </Button>
      </div>
    </span>,
    <span key={item.id}>
      <small className={classes.tdNumberSmall}>SOL</small> {item.priceSol * item.quantity}
    </span>,
    <Tooltip
      key={item.id}
      id={`close-${item.id}`}
      title="Remove item"
      placement="left"
      classes={{ tooltip: classes.tooltip }}
    >
      <Button link className={classes.removeButton} onClick={() => handleRemoveItem(item.id)}>
        <Close />
      </Button>
    </Tooltip>
  ]).concat([
    {
      purchase: true,
      colspan: "3",
      amount: (
        <span>
          <small>SOL</small> {totalAmount}
        </span>
      ),
      col: {
        colspan: 3,
        text: (
          <Button color="rose" round>
            Complete Purchase <KeyboardArrowRight />
          </Button>
        )
      }
    }
  ]);

  // Mobile card view
  const mobileCartView = cartItems.map((item) => (
    <div className={classes.mobileCard} key={item.id}>
      <img src={item.image} alt={item.name} className={classes.mobileImg} />
      <div className={classes.mobileDetails}>
        <a href={`/products/${item.id}`} className={classes.tdNameAnchor}>
          {item.name}
        </a>
        <br />
        <small className={classes.tdNameSmall}>by {item.seller}</small>
        <p>Color: {item.color}</p>
        <p>Size: {item.size}</p>
        <p>Price: <small>SOL</small> {item.priceSol}</p>
        <div className={classes.mobileButtonGroup}>
          <Button
            color="rose"
            size="sm"
            round
            onClick={() => handleQuantityChange(item.id, -1)}
          >
            <Remove />
          </Button>
          <span className={classes.mobileQuantityNumber}>{item.quantity}</span>
          <Button
            color="rose"
            size="sm"
            round
            onClick={() => handleQuantityChange(item.id, 1)}
          >
            <Add />
          </Button>
        </div>
        <p>Amount: <small>SOL</small> {item.priceSol * item.quantity}</p>
        <div className={classes.removeButtonContainer}>
          <Button link className={classes.removeButton} onClick={() => handleRemoveItem(item.id)}>
            <Close />
          </Button>
        </div>
      </div>
    </div>
  ));

  return (
    <div>
      <Header
        brand="F4cets Marketplace"
        links={<HeaderLinks dropdownHoverColor="rose" />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 300,
          color: "dark"
        }}
      />
      <Parallax image="/img/nextjs_header.jpg" filter="dark" className={classes.parallaxSmall}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem
              md={8}
              sm={8}
              className={classNames(classes.mlAuto, classes.mrAuto, classes.textCenter)}
            >
              <h2 className={classes.title}>Shopping Cart</h2>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <Card plain>
            <CardBody plain>
              <h3 className={classes.cardTitle}>Shopping Cart</h3>
              {isConnected === null ? (
                <div className={classes.textCenter}>
                  <h4>Loading...</h4>
                </div>
              ) : isConnected ? (
                cartItems.length > 0 ? (
                  <>
                    {/* Desktop View */}
                    <div className={classes.desktopView}>
                      <Table
                        tableHead={[
                          "",
                          "PRODUCT",
                          "COLOR",
                          "SIZE",
                          "PRICE",
                          "QTY",
                          "AMOUNT",
                          ""
                        ]}
                        tableData={tableData}
                        tableShopping
                        customHeadCellClasses={[
                          classes.textCenter,
                          classes.description,
                          classes.description,
                          classes.textRight,
                          classes.textRight,
                          classes.textRight
                        ]}
                        customHeadClassesForCells={[0, 2, 3, 4, 5, 6]}
                        customCellClasses={[
                          classes.tdName,
                          classes.customFont,
                          classes.customFont,
                          classes.tdNumber,
                          classes.tdNumber + " " + classes.tdNumberAndButtonGroup,
                          classes.tdNumber + " " + classes.textCenter
                        ]}
                        customClassesForCells={[1, 2, 3, 4, 5, 6]}
                      />
                    </div>
                    {/* Mobile View */}
                    <div className={classes.mobileView}>
                      {mobileCartView}
                      <div className={classes.mobileTotal}>
                        Total: <small>SOL</small> {totalAmount}
                      </div>
                      <Button color="rose" round fullWidth>
                        Complete Purchase <KeyboardArrowRight />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className={classes.textCenter}>
                    <h4>Your cart is empty.</h4>
                  </div>
                )
              ) : (
                <div className={classes.textCenter}>
                  <h2>Please connect your Solana wallet to view your cart</h2>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}