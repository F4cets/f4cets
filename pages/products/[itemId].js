/*eslint-disable*/
import React, { useState, useEffect } from "react";
import Head from "next/head";
import classNames from "classnames";
import ImageGallery from "react-image-gallery";
import makeStyles from '@mui/styles/makeStyles';
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import LocalShipping from "@mui/icons-material/LocalShipping";
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import Favorite from "@mui/icons-material/Favorite";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Header from "/components/Header/Header.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import Parallax from "/components/Parallax/Parallax.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Button from "/components/CustomButtons/Button.js";
import Accordion from "/components/Accordion/Accordion.js";
import InfoArea from "/components/InfoArea/InfoArea.js";
import { useWallet } from '@solana/wallet-adapter-react';
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase"; // Exact import as specified
import productStyle from "/styles/jss/nextjs-material-kit-pro/pages/productStyle.js";

const useStyles = makeStyles({
  ...productStyle,
  title: {
    ...productStyle.title,
    fontFamily: '"Quicksand", sans-serif',
    fontSize: '20px',
    fontWeight: 500,
    color: '#333',
  },
  description: {
    ...productStyle.description,
    fontFamily: '"Quicksand", sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    color: '#777',
  },
  mainPrice: {
    ...productStyle.mainPrice,
    fontFamily: '"Quicksand", sans-serif',
    fontSize: '18px',
    fontWeight: 400,
    color: '#555',
  },
  selectFormControl: {
    ...productStyle.selectFormControl,
    '& label': {
      fontFamily: '"Quicksand", sans-serif',
      fontSize: '12px',
      fontWeight: 400,
      color: '#777',
    },
  },
  selectMenuItem: {
    ...productStyle.selectMenuItem,
    fontFamily: '"Quicksand", sans-serif',
    fontSize: '12px',
    fontWeight: 400,
  },
  snackbar: {
    fontFamily: '"Quicksand", sans-serif',
    fontSize: { xs: '14px', md: '16px' }, // Larger font on desktop
    '& .MuiAlert-root': {
      backgroundColor: '#4d455d', // Dark theme for Phantom aesthetic
      color: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      alignItems: 'center',
      padding: { xs: '8px 16px', md: '12px 24px' }, // Larger padding on desktop
      width: { xs: 'auto', md: '400px' }, // Wider on desktop
      maxWidth: '90vw', // Prevent overflow
      '& .MuiAlert-message': {
        fontWeight: 400,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: { xs: '12px', md: '16px' }, // Fallback padding-left
      },
    },
  },
  snackbarAvatar: {
    width: { xs: '24px', md: '32px' }, // Larger thumbnail on desktop
    height: { xs: '24px', md: '32px' },
    marginRight: { xs: '8px', md: '12px' }, // Original spacing
  },
});

export default function ProductPage(props) {
  const { itemId, storeName, headerImage, item, variants, availableColors, availableSizes, maxQuantity } = props;
  const [colorSelect, setColorSelect] = useState(availableColors[0] || "");
  const [sizeSelect, setSizeSelect] = useState(availableSizes[0] || "");
  const [quantitySelect, setQuantitySelect] = useState("1");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const classes = useStyles();
  const { connected, publicKey } = useWallet();
  const [walletId, setWalletId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (connected && publicKey) {
      const walletAddress = publicKey.toBase58();
      setWalletId(walletAddress);
      console.log("Wallet ID:", walletAddress);
      syncLocalCartToFirestore(walletAddress);
    } else {
      setWalletId(null);
    }
  }, [connected, publicKey]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const addToCart = async () => {
    if (!walletId) {
      setError("Please connect your wallet to add items to the cart.");
      setSnackbarMessage("Please connect your wallet.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const cartItem = {
        productId: itemId,
        storeId: item.storeId,
        sellerId: item.sellerId,
        name: item.name,
        priceUsdc: item.priceUsdc,
        quantity: parseInt(quantitySelect, 10),
        color: item.type === "rwi" ? colorSelect : null,
        size: item.type === "rwi" ? sizeSelect : null,
        imageUrl: item.imageUrls?.[0] || "/img/examples/default.jpg",
        addedAt: serverTimestamp(),
        walletId,
      };

      const cartRef = doc(db, `users/${walletId}/cart`, itemId);
      await setDoc(cartRef, cartItem, { merge: true });
      console.log("Added to Firestore cart:", cartItem);
      setSnackbarMessage(`${item.name} added to cart!`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError(`Failed to add item to cart: ${err.message}`);
      setSnackbarMessage(`Failed to add ${item.name} to cart.`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const syncLocalCartToFirestore = async (walletId) => {
    try {
      const localCart = JSON.parse(localStorage.getItem('cart') || '{}');
      if (Object.keys(localCart).length === 0) return;

      for (const itemId in localCart) {
        const cartItem = localCart[itemId];
        const cartRef = doc(db, `users/${walletId}/cart`, itemId);
        await setDoc(cartRef, { ...cartItem, addedAt: serverTimestamp(), walletId }, { merge: true });
        console.log("Synced local cart item to Firestore:", cartItem);
      }
      localStorage.removeItem('cart');
    } catch (err) {
      console.error("Error syncing local cart:", err);
    }
  };

  const images = item.imageUrls
    ? item.imageUrls.map(url => ({ original: url, thumbnail: url }))
    : [{ original: "/img/examples/default.jpg", thumbnail: "/img/examples/default.jpg" }];

  return (
    <div className={classes.productPage}>
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
        links={<HeaderLinks dropdownHoverColor="dark" />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 100,
          color: "dark"
        }}
      />
      <Parallax
        image={headerImage}
        filter="dark"
        className={classes.pageHeader}
      />
      <div className={classNames(classes.section, classes.sectionGray)}>
        <div className={classes.container}>
          <div className={classNames(classes.main, classes.mainRaised)}>
            {error ? (
              <GridContainer justifyContent="center">
                <GridItem xs={12} sm={6} md={6} className={classes.textCenter}>
                  <h2>Error: {error}</h2>
                </GridItem>
              </GridContainer>
            ) : connected ? (
              <GridContainer>
                <GridItem md={6} sm={6}>
                  <ImageGallery
                    showFullscreenButton={false}
                    showPlayButton={false}
                    startIndex={0}
                    items={images}
                    showThumbnails={true}
                    renderLeftNav={(onClick, disabled) => (
                      <button
                        className="image-gallery-left-nav"
                        disabled={disabled}
                        onClick={onClick}
                      />
                    )}
                    renderRightNav={(onClick, disabled) => (
                      <button
                        className="image-gallery-right-nav"
                        disabled={disabled}
                        onClick={onClick}
                      />
                    )}
                  />
                </GridItem>
                <GridItem md={6} sm={6}>
                  <h2 className={classes.title}>{item.name}</h2>
                  <h4 className={classes.description}>
                    {item.inventory > 0 ? `${item.inventory} in stock` : "Out of stock"}
                  </h4>
                  <h3 className={classes.mainPrice}>${item.priceUsdc.toLocaleString()} USDC</h3>
                  <Accordion
                    active={0}
                    activeColor="rose"
                    collapses={[
                      {
                        title: "Description",
                        content: <p>{item.description}</p>
                      },
                      {
                        title: "Seller Information",
                        content: (
                          <p>
                            Sold by {storeName}. {item.sellerInfo || "Quality guaranteed by F4cets Marketplace."}
                          </p>
                        )
                      },
                      {
                        title: "Details and Care",
                        content: (
                          <ul>
                            {item.details && item.details.length > 0 ? (
                              item.details.map((detail, index) => (
                                <li key={index}>{detail}</li>
                              ))
                            ) : (
                              <li>Standard care instructions apply.</li>
                            )}
                          </ul>
                        )
                      }
                    ]}
                  />
                  <GridContainer className={classes.pickSize}>
                    {item.type === "rwi" && (
                      <>
                        <GridItem md={4} sm={4}>
                          <label>Select color</label>
                          <FormControl fullWidth className={classes.selectFormControl}>
                            <Select
                              MenuProps={{ className: classes.selectMenu }}
                              classes={{ select: classes.select }}
                              value={colorSelect}
                              onChange={(event) => setColorSelect(event.target.value)}
                              inputProps={{ name: "colorSelect", id: "color-select" }}
                            >
                              {availableColors.map((color, index) => (
                                <MenuItem
                                  key={index}
                                  classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }}
                                  value={color}
                                >
                                  {color}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </GridItem>
                        <GridItem md={4} sm={4}>
                          <label>Select size</label>
                          <FormControl fullWidth className={classes.selectFormControl}>
                            <Select
                              MenuProps={{ className: classes.selectMenu }}
                              classes={{ select: classes.select }}
                              value={sizeSelect}
                              onChange={(event) => setSizeSelect(event.target.value)}
                              inputProps={{ name: "sizeSelect", id: "size-select" }}
                            >
                              {availableSizes.map((size, index) => (
                                <MenuItem
                                  key={index}
                                  classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }}
                                  value={size}
                                >
                                  {size}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </GridItem>
                      </>
                    )}
                    <GridItem md={4} sm={4}>
                      <label>Quantity</label>
                      <FormControl fullWidth className={classes.selectFormControl}>
                        <Select
                          MenuProps={{ className: classes.selectMenu }}
                          classes={{ select: classes.select }}
                          value={quantitySelect}
                          onChange={(event) => setQuantitySelect(event.target.value)}
                          inputProps={{ name: "quantitySelect", id: "quantity-select" }}
                        >
                          {[...Array(maxQuantity)].map((_, index) => {
                            const qty = index + 1;
                            return (
                              <MenuItem
                                key={qty}
                                classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }}
                                value={qty.toString()}
                              >
                                {qty}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <GridContainer className={classes.pullRight}>
                    <Button
                      round
                      color="rose"
                      disabled={item.inventory === 0}
                      onClick={addToCart}
                    >
                      Add to Cart <ShoppingCart />
                    </Button>
                  </GridContainer>
                </GridItem>
              </GridContainer>
            ) : (
              <GridContainer justifyContent="center">
                <GridItem xs={12} sm={6} md={6} className={classes.textCenter}>
                  <h2>Please connect your Solana wallet to view this product</h2>
                </GridItem>
              </GridContainer>
            )}
          </div>
          {connected && (
            <div className={classNames(classes.features, classes.textCenter)}>
              <GridContainer>
                <GridItem md={4} sm={4}>
                  <InfoArea
                    title="2 Days Delivery"
                    description="Fast shipping ensures your item arrives within 2 days."
                    icon={LocalShipping}
                    iconColor="info"
                    vertical
                  />
                </GridItem>
                <GridItem md={4} sm={4}>
                  <InfoArea
                    title="Refundable Policy"
                    description="Return within 30 days if not satisfied."
                    icon={VerifiedUser}
                    iconColor="success"
                    vertical
                  />
                </GridItem>
                <GridItem md={4} sm={4}>
                  <InfoArea
                    title="Popular Item"
                    description="One of our top picks this season."
                    icon={Favorite}
                    iconColor="rose"
                    vertical
                  />
                </GridItem>
              </GridContainer>
            </div>
          )}
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        className={classes.snackbar}
        data-testid="cart-snackbar"
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          icon={false}
        >
          <Box display="flex" alignItems="center" gap={{ xs: '12px', md: '16px' }}>
            <Avatar
              src={item.imageUrls?.[0] || "/img/examples/default.jpg"}
              className={classes.snackbarAvatar}
              alt={item.name}
            />
            {snackbarMessage}
          </Box>
        </Alert>
      </Snackbar>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { itemId } = context.params;

  try {
    const productRef = doc(db, "products", itemId);
    console.log("Attempting to fetch product document:", productRef.path);
    const productDoc = await getDoc(productRef);

    console.log("Product fetch result - exists:", productDoc.exists());
    if (!productDoc.exists() || !productDoc.data().isActive) {
      console.log("Product not found or inactive for itemId:", itemId);
      return {
        notFound: true,
      };
    }

    const productData = productDoc.data();
    console.log("Product data:", productData);

    const storeRef = doc(db, "stores", productData.storeId);
    console.log("Attempting to fetch store document:", storeRef.path);
    const storeDoc = await getDoc(storeRef);

    console.log("Store fetch result - exists:", storeDoc.exists());
    if (!storeDoc.exists()) {
      console.log("Store not found for storeId:", productData.storeId);
      return {
        notFound: true,
      };
    }

    const storeData = storeDoc.data();
    console.log("Store data:", storeData);

    let variants = [];
    let availableColors = [];
    let availableSizes = [];
    let maxQuantity = 1;

    if (productData.type === "rwi" && Array.isArray(productData.variants)) {
      variants = productData.variants;
      availableColors = [...new Set(variants.map(v => v.color))].sort();
      availableSizes = [...new Set(variants.map(v => v.size))].sort();
      maxQuantity = variants.reduce((sum, v) => sum + parseInt(v.quantity, 10), 0);
    } else if (productData.type === "digital" && typeof productData.quantity === "number") {
      maxQuantity = Math.min(productData.quantity, 10);
    }

    console.log("Variants:", variants);
    console.log("Available colors:", availableColors);
    console.log("Available sizes:", availableSizes);
    console.log("Max quantity:", maxQuantity);

    const item = {
      name: productData.name || "Unnamed Product",
      imageUrls: productData.imageUrls || [productData.selectedImage || "/img/examples/default.jpg"],
      priceUsdc: productData.price || 0,
      inventory: productData.type === "digital" ? productData.quantity || 0 : productData.variants?.reduce((sum, v) => sum + parseInt(v.quantity, 10), 0) || 0,
      description: productData.description || "No description available.",
      sellerInfo: storeData.businessInfo?.sellerInfo || "Quality guaranteed by F4cets Marketplace.",
      details: productData.details || ["Standard care instructions apply."],
      type: productData.type || "unknown",
      storeId: productData.storeId,
      sellerId: productData.sellerId,
    };

    return {
      props: {
        itemId,
        sellerId: productData.sellerId || "unknown",
        storeName: storeData.name || "Unnamed Store",
        headerImage: storeData.bannerUrl || "/img/examples/exampleshop1.jpg",
        item,
        variants,
        availableColors,
        availableSizes,
        maxQuantity,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error.message, error.stack);
    return {
      props: {
        error: `Failed to fetch product/store: ${error.message}`,
      },
    };
  }
}