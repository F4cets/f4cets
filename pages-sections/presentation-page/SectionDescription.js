import React from "react";
// core components
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import InfoArea from "/components/InfoArea/InfoArea.js";

// @material-ui icons
import Apps from "@mui/icons-material/Apps";
import ViewDay from "@mui/icons-material/ViewDay";
import ViewCarousel from "@mui/icons-material/ViewCarousel";
import makeStyles from "@mui/styles/makeStyles";

import descriptionStyle from "/styles/jss/nextjs-material-kit-pro/pages/presentationSections/descriptionStyle.js";

const useStyles = makeStyles(descriptionStyle);

export default function SectionDescription() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <div className={classes.container}>
        <GridContainer justifyContent="center">
          <GridItem md={8} sm={8}>
            <h4 className={classes.description}>
              F4cets Marketplace is a place where people can Buy, Mint, & Sell 
              RWA "Real Word Asset" NFTs.  Simply connect your Solana wallet
              find the RWA and click Buy we take care of everything else. 
              Want to Mint your own RWA NFT?  Simple create an account with F4cet
              Marketplace and we walk you through the Minting process. 
              Want to Sell RWA NFTs on our MarketPace? This is simple too!
              Create a seller account and we will walk you through the process.
            </h4>
          </GridItem>
        </GridContainer>
        <div className={classes.features}>
          <GridContainer>
            <GridItem md={4} sm={4}>
              <InfoArea
                title="Huge Number of Sellers"
                description="Lots of great sellers looking for amazing buyers.  All built on Solana with F4cets cutting edge technology. Shopping with crypto as never been easier or more secure."
                icon={Apps}
                iconColor="danger"
                vertical={true}
              />
            </GridItem>
            <GridItem md={4} sm={4}>
              <InfoArea
                title="Multi-Purpose Platform"
                description="Putting together buyers and sellers from both Web2.0 and Web3.0 for a streamline beautiful experience. Shop with Web3.0 only sellers or shop with Web2.0 legacy. Get rewarded either way!"
                icon={ViewDay}
                iconColor="primary"
                vertical={true}
              />
            </GridItem>
            <GridItem md={4} sm={4}>
              <InfoArea
                title="New Sellers Daily"
                description="New buyers and sellers are joining F4cet Marketplace daily to experience the future of blockchain integration. Come try the future of shopping and selling."
                icon={ViewCarousel}
                iconColor="success"
                vertical={true}
              />
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
  );
}
