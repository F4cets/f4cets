import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// core components
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import makeStyles from "@mui/styles/makeStyles";

import cardsStyle from "/styles/jss/nextjs-material-kit-pro/pages/presentationSections/cardsStyle.js";

const useStyles = makeStyles(cardsStyle);

export default function SectionCards() {
  const classes = useStyles();
  return (
    <div className={classNames(classes.section, classes.sectionDark)}>
      <div className={classes.container}>
        <GridContainer justifyContent="center" direction="column" className={classes.gridContainer}>
          <GridItem md={7} sm={7} xs={12} className={classes.imageGridItem}>
            <div className={classes.imageContainer}>
              <img src="/img/assets-for-demo/cards-test.png" alt="views" />
            </div>
          </GridItem>
          <GridItem md={4} sm={5} xs={12} className={classes.textGridItem}>
            <div className={classes.sectionDescription}>
              <h3 className={classes.title}>Unconventional NFTs</h3>
              <h6 className={classes.description}>
                One NFT for Every RWA
              </h6>
              <h5 className={classes.description}>
                We love NFTs and everybody on the web seems to. We have gone
                above and beyond with options for you to Buy, Create, or Sell 
                RWA NFTs. From NFTs designed for your hand made items, to product
                NFTs for mass produced items, you will have many options to choose
                from. All the NFTs follow the MPL Core principles work perfectly on
                Solana. Think of our F4cet MarketPlace as your 1 stop shop for RWA 
                NFTs that can be purchased and Real World Items shipped directly to
                you at the push of a button and at Solana speeds.
              </h5>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}