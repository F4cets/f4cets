/*eslint-disable*/
import React from "react";
import classNames from "classnames";
import makeStyles from '@mui/styles/makeStyles';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Header from "/components/Header/Header.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Parallax from "/components/Parallax/Parallax.js";
import Footer from "/components/Footer/Footer.js";
import SectionProducts from "/pages-sections/ecommerce/SectionProducts.js";
import styles from "/styles/jss/nextjs-material-kit-pro/pages/ecommerceStyle.js";

const useStyles = makeStyles(styles);

export default function EcommercePage(props) {
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  const classes = useStyles();
  const { sellerId, storeName, promoText, headerImage } = props; // Get dynamic props

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
        <SectionProducts /> {/* Static for now, dynamic later */}
      </div>

      <Footer
        theme="dark"
        content={<div></div>}
      >
        <GridContainer>
          {/* Empty for now */}
        </GridContainer>
      </Footer>
    </div>
  );
}

// Fetch sellerId and sample data server-side
export async function getServerSideProps(context) {
  const { sellerId } = context.params; // walletId from URL

  // Sample data (replace with Firestore later)
  const storeName = "Sample Seller Store"; // Seller sets this in admin panel
  const promoText = "Free shipping on orders over 10 SOL! Use code F4CETS10."; // Seller customizes
  const headerImage = "/img/examples/exampleshop1.jpg"; // Seller uploads later

  return {
    props: {
      sellerId,
      storeName,
      promoText,
      headerImage,
    },
  };
}