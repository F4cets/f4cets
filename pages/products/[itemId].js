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
import Header from "/components/Header/Header.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import Parallax from "/components/Parallax/Parallax.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Button from "/components/CustomButtons/Button.js";
import Accordion from "/components/Accordion/Accordion.js";
import InfoArea from "/components/InfoArea/InfoArea.js";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import productStyle from "/styles/jss/nextjs-material-kit-pro/pages/productStyle.js";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const useStyles = makeStyles({
  ...productStyle,
  title: {
    ...productStyle.title,
    fontFamily: '"Quicksand", sans-serif',
    fontSize: '20px', // Smaller, clean
    fontWeight: 500, // Medium
    color: '#333', // Dark, subtle
  },
  description: {
    ...productStyle.description,
    fontFamily: '"Quicksand", sans-serif',
    fontSize: '14px', // Subtle
    fontWeight: 400, // Regular
    color: '#777', // Light gray
  },
  mainPrice: {
    ...productStyle.mainPrice,
    fontFamily: '"Quicksand", sans-serif',
    fontSize: '18px', // Subtle
    fontWeight: 400, // Regular
    color: '#555', // Mid-gray
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
});

export default function ProductPage(props) {
  const { itemId, storeName, headerImage, item, variants, availableColors, availableSizes, maxQuantity } = props;
  const [colorSelect, setColorSelect] = React.useState(availableColors[0] || "");
  const [sizeSelect, setSizeSelect] = React.useState(availableSizes[0] || "");
  const [quantitySelect, setQuantitySelect] = React.useState("1");
  const classes = useStyles();
  const { connected, publicKey } = useWallet();
  const [walletId, setWalletId] = useState(null);

  useEffect(() => {
    if (connected && publicKey) {
      const walletAddress = publicKey.toBase58();
      setWalletId(walletAddress);
      console.log("Wallet ID:", walletAddress);
    } else {
      setWalletId(null);
    }
  }, [connected, publicKey]);

  // Image gallery using imageUrls
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
            {connected ? (
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
                    <Button round color="rose" disabled={item.inventory === 0}>
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
    </div>
  );
}

export async function getServerSideProps(context) {
  const { itemId } = context.params;

  try {
    // Fetch product data
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

    // Fetch store data
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

    // Prepare variants for rwi products
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
      maxQuantity = Math.min(productData.quantity, 10); // Cap at 10 for selector
    }

    console.log("Variants:", variants);
    console.log("Available colors:", availableColors);
    console.log("Available sizes:", availableSizes);
    console.log("Max quantity:", maxQuantity);

    // Prepare item object
    const item = {
      name: productData.name || "Unnamed Product",
      imageUrls: productData.imageUrls || [productData.selectedImage || "/img/examples/default.jpg"],
      priceUsdc: productData.price || 0,
      inventory: productData.type === "digital" ? productData.quantity || 0 : productData.variants?.reduce((sum, v) => sum + parseInt(v.quantity, 10), 0) || 0,
      description: productData.description || "No description available.",
      sellerInfo: storeData.businessInfo?.sellerInfo || "Quality guaranteed by F4cets Marketplace.",
      details: productData.details || ["Standard care instructions apply."],
      type: productData.type || "unknown",
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