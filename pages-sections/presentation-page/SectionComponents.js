import React from "react";
// core components
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import makeStyles from "@mui/styles/makeStyles";

import componentsStyle from "/styles/jss/nextjs-material-kit-pro/pages/presentationSections/componentsStyle.js";

const useStyles = makeStyles(componentsStyle);

export default function SectionComponents() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <div className={classes.container}>
        <GridContainer justifyContent="center">
          <GridItem md={5} lg={5} sm={12} xs={12}>
            <h3 className={classes.title}>Buy, Mint, Sell RWA NFTs</h3>
            <h6 className={classes.description}>
              The 1 Stop Shop 4 RWA NFTs
            </h6>
            <h5 className={classes.description}>
              Looking to Buy a real world item? Check out our Sellers.
              Want to Mint your very own RWA NFT for yourself? 
              We have you covered and it will Mint directly to your wallet.
              Selling individual or handcrafted Real World Items and want to 
              reach the Solana ecosystem? We are designed to do just that.
              If you sell RWI that are mass produced we got you covered too.
              Create a seller account today.  We will walk you through each 
              step and help you make sure everything running perfectly before 
              your site goes live.
            </h5>
          </GridItem>
          <GridItem xs={12} sm={12} md={6} lg={6} className={classes.mlAuto}>
            <div className={classes.imageContainer}>
              <img
                src="/img/assets-for-demo/presentationViewSectionComponent/laptop-basics.png"
                alt="macbook"
                className={classes.componentsMacbook}
              />
              <img
                src="/img/assets-for-demo/presentationViewSectionComponent/table.jpg"
                alt="macbook"
                className={classes.shoppingCart}
              />
              <img
                src="/img/assets-for-demo/presentationViewSectionComponent/share-btn.png"
                alt="macbook"
                className={classes.shareButton}
              />
              <img
                src="/img/assets-for-demo/presentationViewSectionComponent/coloured-card-with-btn.jpg"
                alt="macbook"
                className={classes.cardImage}
              />
              <img
                src="/img/assets-for-demo/presentationViewSectionComponent/coloured-card.jpg"
                alt="macbook"
                className={classes.twitterImage}
              />
              <img
                src="/img/assets-for-demo/presentationViewSectionComponent/social-row.jpg"
                alt="macbook"
                className={classes.iconsImage}
              />
              <img
                src="/img/assets-for-demo/presentationViewSectionComponent/pin-btn.jpg"
                alt="macbook"
                className={classes.repostImage}
              />
            </div>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
