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

const useStyles = makeStyles(styles);

export default function EcommercePage(props) {
  const { sellerId, storeName, promoText, headerImage, listings } = props;
  const classes = useStyles();
  const { connected, publicKey } = useWallet(); // Check wallet connection
  const [walletId, setWalletId] = useState(null); // Track wallet ID

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  // Update walletId when connected
  useEffect(() => {
    if (connected && publicKey) {
      const walletAddress = publicKey.toBase58();
      setWalletId(walletAddress);
      console.log("Wallet ID:", walletAddress); // Log for tracking
    } else {
      setWalletId(null);
    }
  }, [connected, publicKey]);

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
          <DynamicProducts sellerId={sellerId} listings={listings} />
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
  const { sellerId } = context.params;

  const storeName = "Sample Seller Store";
  const promoText = "Free shipping on orders over 10 SOL! Use code F4CETS10.";
  const headerImage = "/img/examples/exampleshop1.jpg";
  const sampleListings = [
    { id: '1', name: 'Dog Bed', priceSol: 10, priceWndo: 9, imageUrl: '/img/examples/dogbed.jpg', inventory: 5, category: 'Pet Supplies' },
    { id: '2', name: 'Vase', priceSol: 15, priceWndo: 13.5, imageUrl: '/img/examples/vase.jpg', inventory: 3, category: 'Home Decor' },
    { id: '3', name: 'Cat Toy', priceSol: 5, priceWndo: 4.5, imageUrl: '/img/examples/dogbed.jpg', inventory: 10, category: 'Pet Supplies' },
    { id: '4', name: 'Lamp', priceSol: 20, priceWndo: 18, imageUrl: '/img/examples/vase.jpg', inventory: 2, category: 'Home Decor' },
    { id: '5', name: 'Bowl', priceSol: 8, priceWndo: 7.2, imageUrl: '/img/examples/dogbed.jpg', inventory: 7, category: 'Pet Supplies' },
    { id: '6', name: 'Picture Frame', priceSol: 12, priceWndo: 10.8, imageUrl: '/img/examples/vase.jpg', inventory: 4, category: 'Home Decor' },
    { id: '7', name: 'Pet Collar', priceSol: 6, priceWndo: 5.4, imageUrl: '/img/examples/dogbed.jpg', inventory: 15, category: 'Pet Supplies' },
    { id: '8', name: 'Candle Holder', priceSol: 18, priceWndo: 16.2, imageUrl: '/img/examples/vase.jpg', inventory: 6, category: 'Home Decor' },
    { id: '9', name: 'Dog Leash', priceSol: 9, priceWndo: 8.1, imageUrl: '/img/examples/dogbed.jpg', inventory: 8, category: 'Pet Supplies' },
    { id: '10', name: 'Wall Clock', priceSol: 25, priceWndo: 22.5, imageUrl: '/img/examples/vase.jpg', inventory: 1, category: 'Home Decor' },
    { id: '11', name: 'Cat Bed', priceSol: 11, priceWndo: 9.9, imageUrl: '/img/examples/dogbed.jpg', inventory: 3, category: 'Pet Supplies' },
    { id: '12', name: 'Rug', priceSol: 30, priceWndo: 27, imageUrl: '/img/examples/vase.jpg', inventory: 5, category: 'Home Decor' },
    { id: '13', name: 'Pet Bowl', priceSol: 7, priceWndo: 6.3, imageUrl: '/img/examples/dogbed.jpg', inventory: 12, category: 'Pet Supplies' },
    { id: '14', name: 'Mirror', priceSol: 22, priceWndo: 19.8, imageUrl: '/img/examples/vase.jpg', inventory: 4, category: 'Home Decor' },
    { id: '15', name: 'Chew Toy', priceSol: 4, priceWndo: 3.6, imageUrl: '/img/examples/dogbed.jpg', inventory: 20, category: 'Pet Supplies' },
    { id: '16', name: 'Bookshelf', priceSol: 35, priceWndo: 31.5, imageUrl: '/img/examples/vase.jpg', inventory: 2, category: 'Home Decor' },
    { id: '17', name: 'Cat Scratcher', priceSol: 13, priceWndo: 11.7, imageUrl: '/img/examples/dogbed.jpg', inventory: 6, category: 'Pet Supplies' },
    { id: '18', name: 'Table Runner', priceSol: 17, priceWndo: 15.3, imageUrl: '/img/examples/vase.jpg', inventory: 8, category: 'Home Decor' },
    { id: '19', name: 'Pet Brush', priceSol: 6.5, priceWndo: 5.85, imageUrl: '/img/examples/dogbed.jpg', inventory: 9, category: 'Pet Supplies' },
    { id: '20', name: 'Curtains', priceSol: 28, priceWndo: 25.2, imageUrl: '/img/examples/vase.jpg', inventory: 3, category: 'Home Decor' },
    { id: '21', name: 'Dog Treats', priceSol: 3, priceWndo: 2.7, imageUrl: '/img/examples/dogbed.jpg', inventory: 25, category: 'Pet Supplies' },
    { id: '22', name: 'Plant Pot', priceSol: 14, priceWndo: 12.6, imageUrl: '/img/examples/vase.jpg', inventory: 7, category: 'Home Decor' },
    { id: '23', name: 'Catnip Toy', priceSol: 4.5, priceWndo: 4.05, imageUrl: '/img/examples/dogbed.jpg', inventory: 15, category: 'Pet Supplies' },
    { id: '24', name: 'Coaster Set', priceSol: 9.5, priceWndo: 8.55, imageUrl: '/img/examples/vase.jpg', inventory: 10, category: 'Home Decor' },
    { id: '25', name: 'Pet Mat', priceSol: 12.5, priceWndo: 11.25, imageUrl: '/img/examples/dogbed.jpg', inventory: 4, category: 'Pet Supplies' },
    { id: '26', name: 'Wall Art', priceSol: 40, priceWndo: 36, imageUrl: '/img/examples/vase.jpg', inventory: 1, category: 'Home Decor' },
    { id: '27', name: 'Dog Harness', priceSol: 11.5, priceWndo: 10.35, imageUrl: '/img/examples/dogbed.jpg', inventory: 6, category: 'Pet Supplies' },
    { id: '28', name: 'Pillow', priceSol: 16, priceWndo: 14.4, imageUrl: '/img/examples/vase.jpg', inventory: 5, category: 'Home Decor' },
    { id: '29', name: 'Cat Treats', priceSol: 3.5, priceWndo: 3.15, imageUrl: '/img/examples/dogbed.jpg', inventory: 20, category: 'Pet Supplies' },
    { id: '30', name: 'Desk Organizer', priceSol: 19, priceWndo: 17.1, imageUrl: '/img/examples/vase.jpg', inventory: 3, category: 'Home Decor' },
  ];

  return {
    props: {
      sellerId,
      storeName,
      promoText,
      headerImage,
      listings: sampleListings,
    },
  };
}