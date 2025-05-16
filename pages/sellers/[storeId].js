/*eslint-disable*/
import React, { useState, useEffect } from "react";
import classNames from "classnames";
import makeStyles from '@mui/styles/makeStyles';
import Header from "/components/Header/Header.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Parallax from "/components/Parallax/Parallax.js";
import DynamicProducts from "/pages-sections/ecommerce/DynamicProducts.js";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import styles from "/styles/jss/nextjs-material-kit-pro/pages/ecommerceStyle.js";
import { db } from "../../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

const useStyles = makeStyles(styles);

export default function SellerStorePage(props) {
  const { storeId, storeName, promoText, headerImage, listings, error } = props;
  const classes = useStyles();
  const { connected, publicKey } = useWallet();
  const [walletId, setWalletId] = useState(null);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (connected && publicKey) {
      const walletAddress = publicKey.toBase58();
      setWalletId(walletAddress);
      console.log("Wallet ID:", walletAddress);
    } else {
      setWalletId(null);
    }
  }, [connected, publicKey]);

  if (error) {
    return (
      <div>
        <Header
          brand="F4cets Marketplace"
          links={<HeaderLinks dropdownHoverColor="info" />}
          fixed
          color="transparent"
          changeColorOnScroll={{
            height: 300,
            color: "info"
          }}
        />
        <div className={classNames(classes.main, classes.mainRaised)}>
          <GridContainer justifyContent="center">
            <GridItem xs={12} sm={6} md={6} className={classes.textCenter}>
              <h2>Error: {error}</h2>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        brand="F4cets Marketplace"
        links={<HeaderLinks dropdownHoverColor="info" />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 300,
          color: "info"
        }}
      />
      <Parallax image={headerImage} filter="dark" small>
        <div className={classes.container}>
          <GridContainer>
            <GridItem
              md={8}
              sm={8}
              className={classNames(
                classes.mlAuto,
                classes.mrAuto,
                classes.textCenter
              )}
            >
              <div className={classes.brand}>
                <h1 className={classes.title}>{storeName}</h1>
                <h4>{promoText}</h4>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

      <div className={classNames(classes.main, classes.mainRaised)}>
        {connected ? (
          <DynamicProducts storeId={storeId} listings={listings} />
        ) : (
          <GridContainer justifyContent="center">
            <GridItem xs={12} sm={6} md={6} className={classes.textCenter}>
              <h2>Please connect your Solana wallet to view this shop</h2>
            </GridItem>
          </GridContainer>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { storeId } = context.params;
  console.log("getServerSideProps: Fetching store with storeId:", storeId);

  try {
    // Verify Firebase initialization
    if (!db) {
      console.error("Firestore db is not initialized");
      return {
        props: {
          error: "Firestore database not initialized",
        },
      };
    }

    // Fetch store data
    const storeRef = doc(db, "stores", storeId);
    console.log("Attempting to fetch store document:", storeRef.path);
    const storeDoc = await getDoc(storeRef);

    console.log("Store fetch result - exists:", storeDoc.exists());
    if (storeDoc.exists()) {
      console.log("Store data:", storeDoc.data());
    } else {
      console.log("Store document does not exist for storeId:", storeId);
      return {
        notFound: true,
      };
    }

    const storeData = storeDoc.data();

    // Fetch products data
    const productsRef = collection(db, "products");
    const productsQuery = query(
      productsRef,
      where("storeId", "==", storeId),
      where("isActive", "==", true)
    );
    console.log("Executing products query for storeId:", storeId);
    const productsSnapshot = await getDocs(productsQuery);
    console.log("Products found:", productsSnapshot.docs.length);
    console.log("Product IDs:", productsSnapshot.docs.map(doc => doc.id));

    const listings = productsSnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Processing product:", doc.id, {
        name: data.name,
        type: data.type,
        price: data.price,
        isActive: data.isActive,
        storeId: data.storeId,
        variants: data.variants,
        quantity: data.quantity,
      });

      // Price in USDC (from database)
      const priceUsdc = data.price || 0;
      const priceWndo = priceUsdc * 0.9; // 10% discount for WNDO

      // Calculate inventory
      let inventory = 0;
      if (data.type === "digital" && typeof data.quantity === "number") {
        inventory = data.quantity;
      } else if (data.type === "rwi" && Array.isArray(data.variants)) {
        inventory = data.variants.reduce((sum, variant) => {
          const qty = parseInt(variant.quantity, 10);
          return sum + (isNaN(qty) ? 0 : qty);
        }, 0);
      }
      console.log("Calculated inventory for", data.name, ":", inventory);

      return {
        id: doc.id,
        name: data.name || "Unnamed Product",
        priceUsdc, // USDC price
        priceWndo,
        imageUrl: data.imageUrls?.[0] || data.selectedImage || "/img/examples/default.jpg",
        inventory,
        category: data.categories?.[0] || "Uncategorized",
        type: data.type || "unknown", // Add type for filtering
      };
    });

    console.log("Final listings:", listings);

    return {
      props: {
        storeId,
        storeName: storeData.name || "Unnamed Store",
        promoText: storeData.description || "Explore unique products at great prices!",
        headerImage: storeData.bannerUrl || "/img/examples/exampleshop1.jpg",
        listings,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error.message, error.stack);
    return {
      props: {
        error: `Failed to fetch store/products: ${error.message}`,
      },
    };
  }
}