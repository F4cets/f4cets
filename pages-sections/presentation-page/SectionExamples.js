import React from "react";
// react components for routing our app without refresh
import Link from "next/link";
// nodejs library that concatenates classes
import classNames from "classnames";
// core components
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Card from "/components/Card/Card.js";
import makeStyles from '@mui/styles/makeStyles';

import examplesStyle from "/styles/jss/nextjs-material-kit-pro/pages/presentationSections/examplesStyle.js";
import imagesStyles from "/styles/jss/nextjs-material-kit-pro/imagesStyles.js";

const styles = {
  ...examplesStyle,
  ...imagesStyles
};

const useStyles = makeStyles(styles);

export default function SectionExamples() {
  const classes = useStyles();
  return (
    <div className={classNames(classes.section, classes.sectionDark)}>
      <div className={classes.container}>
        <GridItem md={8} className={classNames(classes.mrAuto, classes.mlAuto)}>
          <div className={classes.sectionDescription}>
            <h2 className={classes.title}>Top Sellers on the MarketPlace</h2>
            <h5 className={classes.description}>
              Want to sell on the MarketPlace? The easiest way to get started 
              is to sign up as a seller today, and we will walk you through the rest.
              Checkout these top sellers to inspire your RWA NFTs.  Your imagination
              is the only limitation.
            </h5>
          </div>
        </GridItem>
        <GridContainer>
          <GridItem md={4} sm={4} xs={12}>
            <h4 className={classes.title}>Camping Coupons</h4>
            <Card className={classes.imgCardExtended}>
              <Link href={"/about-us"}>
                <img
                  src="/img/assets-for-demo/example-pages/ex-about-us.jpg"
                  alt="Camping Coupons"
                  className={classes.imgCard}
                />
              </Link>
            </Card>
            <h4 className={classes.title}>Trail Guides</h4>
            <Card className={classes.imgCardExtended}>
              <Link href={"/landing-page"}>
                <img
                  src="/img/assets-for-demo/example-pages/ex-landing.jpg"
                  alt="Trail Guides"
                  className={classes.imgCard}
                />
              </Link>
            </Card>
            <h4 className={classes.title}>Faster Tech Support</h4>
            <Card className={classes.imgCardExtended}>
              <Link href={"/contact-us"}>
                <img
                  src="/img/assets-for-demo/example-pages/ex-contact.jpg"
                  alt="Faster Tech Support"
                  className={classes.imgCard}
                />
              </Link>
            </Card>
          </GridItem>
          <GridItem md={4} sm={4} xs={12}>
            <h4 className={classes.title}>Vaca Vouchers</h4>
            <Card className={classes.imgCardExtended}>
              <Link href={"/blog-post"}>
                <img
                  src="/img/assets-for-demo/example-pages/ex-blog-post.jpg"
                  alt="Vaca Vouchers"
                  className={classes.imgCard}
                />
              </Link>
            </Card>
            <h4 className={classes.title}>Pink is In</h4>
            <Card className={classes.imgCardExtended}>
              <Link href={"/product"}>
                <img
                  src="/img/assets-for-demo/example-pages/ex-product.jpg"
                  alt="Pink is In"
                  className={classes.imgCard}
                />
              </Link>
            </Card>
            <h4 className={classes.title}>Token Gated</h4>
            <Card className={classes.imgCardExtended}>
              <Link href={"/login"}>
                <img
                  src="/img/assets-for-demo/example-pages/ex-login.jpg"
                  alt="Token Gated"
                  className={classes.imgCard}
                />
              </Link>
            </Card>
          </GridItem>
          <GridItem md={4} sm={4} xs={12}>
            <h4 className={classes.title}>Limited Access Concerts</h4>
            <Card className={classes.imgCardExtended}>
              <Link href={"/pricing"}>
                <img
                  src="/img/assets-for-demo/example-pages/ex-pricing.jpg"
                  alt="Limited Access Concerts"
                  className={classes.imgCard}
                />
              </Link>
            </Card>
            <h4 className={classes.title}>Register DAO</h4>
            <Card className={classes.imgCardExtended}>
              <Link href={"/signup"}>
                <img
                  src="/img/assets-for-demo/example-pages/ex-register.jpg"
                  alt="Register DAO"
                  className={classes.imgCard}
                />
              </Link>
            </Card>
            <h4 className={classes.title}>Shoes 4 All</h4>
            <Card className={classes.imgCardExtended}>
              <Link href={"/profile"}>
                <img
                  src="/img/assets-for-demo/example-pages/ex-profile.jpg"
                  alt="Shoes 4 All"
                  className={classes.imgCard}
                />
              </Link>
            </Card>
            <h4 className={classes.title}>Training Access</h4>
            <Card className={classes.imgCardExtended}>
              <Link href={"/blog-posts"}>
                <img
                  src="/img/assets-for-demo/example-pages/ex-blog-posts.jpg"
                  alt="Training Access"
                  className={classes.imgCard}
                />
              </Link>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
