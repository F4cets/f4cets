/*eslint-disable*/
import React, { useState, useEffect } from "react";
import Head from "next/head";
import classNames from "classnames";
import makeStyles from '@mui/styles/makeStyles';
import Tooltip from "@mui/material/Tooltip";
import Favorite from "@mui/icons-material/Favorite";
import Close from "@mui/icons-material/Close";
import Remove from "@mui/icons-material/Remove";
import Add from "@mui/icons-material/Add";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Home from "@mui/icons-material/Home";
import LocationCity from "@mui/icons-material/LocationCity";
import PinDrop from "@mui/icons-material/PinDrop";
import Public from "@mui/icons-material/Public";
import Header from "/components/Header/Header.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import Parallax from "/components/Parallax/Parallax.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Table from "/components/Table/Table.js";
import Button from "/components/CustomButtons/Button.js";
import Card from "/components/Card/Card.js";
import CardBody from "/components/Card/CardBody.js";
import CustomInput from "/components/CustomInput/CustomInput.js";
import { useWallet } from '@solana/wallet-adapter-react';
import { collection, query, getDocs, doc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import shoppingCartStyle from "/styles/jss/nextjs-material-kit-pro/pages/shoppingCartStyle.js";
import { motion } from "framer-motion";
import { useSolPrice } from "/lib/getSolPrice"; // Import SOL price hook

const useStyles = makeStyles({
  ...shoppingCartStyle,
  shippingInput: {
    "& input": {
      fontFamily: '"Quicksand", sans-serif',
      fontSize: '14px',
      color: '#212121',
      padding: '10px',
      '&:hover': {
        boxShadow: 'none',
      },
      '&:focus': {
        boxShadow: 'none',
        outline: 'none',
      },
    },
    "& label": {
      fontFamily: '"Quicksand", sans-serif',
      fontSize: '14px',
      color: '#4d455d',
    },
    marginBottom: '15px',
  },
  shippingTotal: {
    fontFamily: '"Quicksand", sans-serif',
    fontSize: '16px',
    fontWeight: 500,
    color: '#212121',
    textAlign: 'right',
    margin: '10px 0',
  },
  formContainer: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  tablePurchase: {
    '& td': {
      fontFamily: '"Quicksand", sans-serif',
      fontSize: '16px',
      fontWeight: 500,
      color: '#212121',
    },
  },
});

export default function ShoppingCartPage() {
  const classes = useStyles();
  const { connected, publicKey } = useWallet();
  const { solPrice, flash } = useSolPrice(); // Get SOL price and flash state
  const [walletId, setWalletId] = useState(null);
  const [isConnected, setIsConnected] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [totalShipping, setTotalShipping] = useState(0);

  useEffect(() => {
    setIsConnected(connected);
    if (connected && publicKey) {
      const walletAddress = publicKey.toBase58();
      setWalletId(walletAddress);
      console.log("Wallet ID:", walletAddress);
      fetchCartItems(walletAddress);
    } else {
      setWalletId(null);
      setCartItems([]);
      setTotalShipping(0);
    }
  }, [connected, publicKey]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (cartItems.length > 0 && shippingAddress.zip && shippingAddress.country) {
      calculateShippingCosts();
    } else {
      setTotalShipping(0);
    }
  }, [cartItems, shippingAddress]);

  const fetchCartItems = async (walletId) => {
    try {
      const cartRef = collection(db, `users/${walletId}/cart`);
      const cartQuery = query(cartRef);
      const cartSnapshot = await getDocs(cartQuery);
      console.log("Cart items found:", cartSnapshot.docs.length);
      const items = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCartItems(items);
      console.log("Cart items:", items);
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setError(`Failed to load cart: ${err.message}`);
    }
  };

  const calculateShippingCosts = async () => {
    let shippingTotal = 0;
    for (const item of cartItems) {
      try {
        const productRef = doc(db, "products", item.productId);
        const productDoc = await getDoc(productRef);
        if (!productDoc.exists()) {
          console.warn(`Product ${item.productId} not found`);
          continue;
        }
        const productData = productDoc.data();
        if (productData.type === "digital") {
          continue; // No shipping cost for digital items
        }
        const isDomestic = shippingAddress.country.toLowerCase().includes('united states') || shippingAddress.country.toLowerCase() === 'us';
        const itemShipping = isDomestic ? 14 : 40;
        shippingTotal += itemShipping * item.quantity;
      } catch (err) {
        console.error(`Error fetching product ${item.productId}:`, err);
      }
    }
    setTotalShipping(shippingTotal);
  };

  const handleShippingChange = (field) => (event) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleQuantityChange = async (itemId, delta) => {
    try {
      const item = cartItems.find(item => item.id === itemId);
      if (!item) return;

      const newQuantity = Math.max(1, item.quantity + delta);
      const cartRef = doc(db, `users/${walletId}/cart`, itemId);
      await setDoc(cartRef, { quantity: newQuantity, walletId }, { merge: true });
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      console.log("Updated quantity for item:", itemId, newQuantity);
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError(`Failed to update quantity: ${err.message}`);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const cartRef = doc(db, `users/${walletId}/cart`, itemId);
      await deleteDoc(cartRef);
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      console.log("Removed item from cart:", itemId);
    } catch (err) {
      console.error("Error removing item:", err);
      setError(`Failed to remove item: ${err.message}`);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.priceUsdc * item.quantity,
    0
  );
  const grandTotal = totalAmount + totalShipping;
  const grandTotalSol = solPrice ? (grandTotal / solPrice).toFixed(4) : 'N/A'; // Convert USDC to SOL

  const tableData = cartItems.map((item) => [
    <div className={classes.imgContainer} key={item.id}>
      <img src={item.imageUrl} alt={item.name} className={classes.img} />
    </div>,
    <span key={item.id}>
      <a href={`/products/${item.productId}`} className={classes.tdNameAnchor}>
        {item.name}
      </a>
    </span>,
    item.color || "N/A",
    item.size || "N/A",
    <span key={item.id}>
      <small>$</small> {item.priceUsdc.toLocaleString()}
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
      <small>$</small> {(item.priceUsdc * item.quantity).toLocaleString()}
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
      col: {
        colspan: 3,
        text: (
          <>
            <div className={classes.shippingTotal}>
              Items Total: <small>$</small> {totalAmount.toLocaleString()}
            </div>
            <div className={classes.shippingTotal}>
              Estimated Shipping: <small>$</small> {totalShipping.toLocaleString()}
            </div>
            <div className={classes.shippingTotal}>
              Grand Total: <small>$</small> {grandTotal.toLocaleString()}&nbsp;
              <motion.span
                animate={flash ? { scale: [1, 1.1, 1], color: ['#212121', '#e90064', '#212121'] } : {}}
                transition={{ duration: 0.5 }}
              >
                ({grandTotalSol} SOL)
              </motion.span>
            </div>
            <GridContainer className={classes.formContainer} spacing={2}>
              <GridItem xs={12} sm={6}>
                <CustomInput
                  labelText="Street Address"
                  id="street"
                  formControlProps={{
                    fullWidth: true,
                    className: classes.shippingInput,
                  }}
                  inputProps={{
                    value: shippingAddress.street,
                    onChange: handleShippingChange('street'),
                    startAdornment: <Home style={{ color: '#4d455d' }} />,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={6}>
                <CustomInput
                  labelText="City"
                  id="city"
                  formControlProps={{
                    fullWidth: true,
                    className: classes.shippingInput,
                  }}
                  inputProps={{
                    value: shippingAddress.city,
                    onChange: handleShippingChange('city'),
                    startAdornment: <LocationCity style={{ color: '#4d455d' }} />,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={6}>
                <CustomInput
                  labelText="State/Province"
                  id="state"
                  formControlProps={{
                    fullWidth: true,
                    className: classes.shippingInput,
                  }}
                  inputProps={{
                    value: shippingAddress.state,
                    onChange: handleShippingChange('state'),
                    startAdornment: <PinDrop style={{ color: '#4d455d' }} />,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={6}>
                <CustomInput
                  labelText="ZIP/Postal Code"
                  id="zip"
                  formControlProps={{
                    fullWidth: true,
                    className: classes.shippingInput,
                  }}
                  inputProps={{
                    value: shippingAddress.zip,
                    onChange: handleShippingChange('zip'),
                    startAdornment: <PinDrop style={{ color: '#4d455d' }} />,
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <CustomInput
                  labelText="Country"
                  id="country"
                  formControlProps={{
                    fullWidth: true,
                    className: classes.shippingInput,
                  }}
                  inputProps={{
                    value: shippingAddress.country,
                    onChange: handleShippingChange('country'),
                    startAdornment: <Public style={{ color: '#4d455d' }} />,
                  }}
                />
              </GridItem>
            </GridContainer>
            <Button color="rose" round style={{ marginTop: '20px' }}>
              Complete Purchase <KeyboardArrowRight />
            </Button>
          </>
        )
      }
    }
  ]);

  const mobileCartView = cartItems.map((item) => (
    <div className={classes.mobileCard} key={item.id}>
      <img src={item.imageUrl} alt={item.name} className={classes.mobileImg} />
      <div className={classes.mobileDetails}>
        <a href={`/products/${item.productId}`} className={classes.tdNameAnchor}>
          {item.name}
        </a>
        <p>Color: {item.color || "N/A"}</p>
        <p>Size: {item.size || "N/A"}</p>
        <p>Price: <small>$</small> {item.priceUsdc.toLocaleString()}</p>
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
        <p>Amount: <small>$</small> {(item.priceUsdc * item.quantity).toLocaleString()}</p>
        <div className={classes.removeButtonContainer}>
          <Button link className={classes.removeButton} onClick={() => handleRemoveItem(item.id)}>
            <Close />
          </Button>
        </div>
      </div>
    </div>
  ));

  const mobileShippingForm = (
    <GridContainer className={classes.formContainer} spacing={2}>
      <GridItem xs={12}>
        <CustomInput
          labelText="Street Address"
          id="street"
          formControlProps={{
            fullWidth: true,
            className: classes.shippingInput,
          }}
          inputProps={{
            value: shippingAddress.street,
            onChange: handleShippingChange('street'),
            startAdornment: <Home style={{ color: '#4d455d' }} />,
          }}
        />
      </GridItem>
      <GridItem xs={12}>
        <CustomInput
          labelText="City"
          id="city"
          formControlProps={{
            fullWidth: true,
            className: classes.shippingInput,
          }}
          inputProps={{
            value: shippingAddress.city,
            onChange: handleShippingChange('city'),
            startAdornment: <LocationCity style={{ color: '#4d455d' }} />,
          }}
        />
      </GridItem>
      <GridItem xs={12}>
        <CustomInput
          labelText="State/Province"
          id="state"
          formControlProps={{
            fullWidth: true,
            className: classes.shippingInput,
          }}
          inputProps={{
            value: shippingAddress.state,
            onChange: handleShippingChange('state'),
            startAdornment: <PinDrop style={{ color: '#4d455d' }} />,
          }}
        />
      </GridItem>
      <GridItem xs={12}>
        <CustomInput
          labelText="ZIP/Postal Code"
          id="zip"
          formControlProps={{
            fullWidth: true,
            className: classes.shippingInput,
          }}
          inputProps={{
            value: shippingAddress.zip,
            onChange: handleShippingChange('zip'),
            startAdornment: <PinDrop style={{ color: '#4d455d' }} />,
          }}
        />
      </GridItem>
      <GridItem xs={12}>
        <CustomInput
          labelText="Country"
          id="country"
          formControlProps={{
            fullWidth: true,
            className: classes.shippingInput,
          }}
          inputProps={{
            value: shippingAddress.country,
            onChange: handleShippingChange('country'),
            startAdornment: <Public style={{ color: '#4d455d' }} />,
          }}
        />
      </GridItem>
    </GridContainer>
  );

  const logoVariants = {
    rest: { scale: 1, rotate: 0, transition: { duration: 0.3 } },
    hover: {
      scale: 1.1,
      rotate: [0, 5, -5, 5, 0],
      transition: { scale: { duration: 0.2 }, rotate: { repeat: 1, duration: 0.5 } },
    },
  };

  return (
    <div>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
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
              {error ? (
                <div className={classes.textCenter}>
                  <h4>Error: {error}</h4>
                </div>
              ) : isConnected === null ? (
                <div className={classes.textCenter}>
                  <h4>Loading...</h4>
                </div>
              ) : isConnected ? (
                cartItems.length > 0 ? (
                  <>
                    <div className={classes.desktopView}>
                      <Table
                        tableHead={["", "PRODUCT", "COLOR", "SIZE", "PRICE", "QTY", "AMOUNT", ""]}
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
                    <div className={classes.mobileView}>
                      {mobileCartView}
                      <div className={classes.mobileTotal}>
                        Items Total: <small>$</small> {totalAmount.toLocaleString()}
                      </div>
                      <div className={classes.mobileTotal}>
                        Estimated Shipping: <small>$</small> {totalShipping.toLocaleString()}
                      </div>
                      <div className={classes.mobileTotal}>
                        Grand Total: <small>$</small> {grandTotal.toLocaleString()}&nbsp;
                        <motion.span
                          animate={flash ? { scale: [1, 1.1, 1], color: ['#212121', '#e90064', '#212121'] } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          (~{grandTotalSol} SOL)
                        </motion.span>
                      </div>
                      {mobileShippingForm}
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
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#212121" }}>
                  <h1
                    style={{
                      fontSize: { xs: "1.5rem", md: "2.5rem" },
                      fontWeight: "bold",
                      marginBottom: "40px",
                      lineHeight: "1.2",
                    }}
                  >
                    Connect Your Wallet to View Your Cart
                  </h1>
                  <GridContainer spacing={3} justifyContent="center">
                    <GridItem xs={12}>
                      <div
                        style={{
                          backgroundColor: "#ffffff",
                          padding: "30px 30px 0 30px",
                          borderRadius: "15px",
                          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
                          textAlign: "center",
                          marginBottom: "30px",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: { xs: "1.5rem", md: "3rem" },
                            marginBottom: "15px",
                          }}
                        >
                          New to Solana or Crypto?
                        </h3>
                        <h4
                          style={{
                            fontSize: { xs: "1.5rem", md: "3.75rem" },
                            marginBottom: "20px",
                          }}
                        >
                          Download
                        </h4>
                        <motion.div
                          variants={logoVariants}
                          initial="rest"
                          whileHover="hover"
                        >
                          <a
                            href="https://chromewebstore.google.com/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src="/img/solflare-logo.png"
                              alt="Solflare Logo"
                              style={{
                                width: "100%",
                                maxWidth: "50%",
                                height: "auto",
                                marginBottom: "20px",
                                display: "block",
                                marginLeft: "auto",
                                marginRight: "auto",
                              }}
                            />
                          </a>
                        </motion.div>
                        <h2
                          style={{
                            fontSize: { xs: "1.25rem", md: "2.5rem" },
                            marginBottom: "20px",
                          }}
                        >
                          Preferred F4cet Marketplace Wallet
                        </h2>
                        <img
                          src="/img/solflare-m.png"
                          alt="Solflare QR Code"
                          style={{
                            width: "100%",
                            maxWidth: "150px",
                            height: "auto",
                            marginBottom: "20px",
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}
                        />
                        <img
                          src="/img/solflareH.png"
                          alt="Solflare Hand"
                          style={{
                            width: "100%",
                            maxWidth: "60%",
                            height: "auto",
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}
                        />
                      </div>
                    </GridItem>
                    <GridItem xs={12}>
                      <div
                        style={{
                          backgroundColor: "#ffffff",
                          padding: "30px",
                          borderRadius: "15px",
                          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
                          textAlign: "center",
                          marginBottom: "30px",
                        }}
                      >
                        <a
                          href="https://chromewebstore.google.com/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src="/img/solflareD.png"
                            alt="Solflare Extension"
                            style={{
                              width: "100%",
                              maxWidth: "70%",
                              height: "auto",
                              display: "block",
                              marginLeft: "auto",
                              marginRight: "auto",
                            }}
                          />
                        </a>
                      </div>
                    </GridItem>
                  </GridContainer>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}