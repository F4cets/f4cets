import React from "react";
// react components for routing our app without refresh
import Link from "next/link";
// nodejs library that concatenates classes
import classNames from "classnames";
// core components
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
// core components
import Button from "/components/CustomButtons/Button.js";
import makeStyles from "@mui/styles/makeStyles";

import sectionsStyle from "/styles/jss/nextjs-material-kit-pro/pages/presentationSections/sectionsStyle.js";

// images array used in rendering a function for this section
import imgs from "/public/img/assets-for-demo/sections/imgs.js";

const useStyles = makeStyles(sectionsStyle);

export default function SectionSections() {
  const renderContainerFluid = (cssClass) => {
    return imgs.map((row) => {
      return (
        <GridContainer key={row[0]}>
          {row.map((el, index) => {
            return (
              <GridItem
                md={3}
                sm={3}
                xs={12}
                key={el + "_" + index}
                className={cssClass}
              >
                <img
                  src={`/img/assets-for-demo/sections/${el}.jpg`}
                  alt={el}
                  key={el[index]}
                />
              </GridItem>
            );
          })}
        </GridContainer>
      );
    });
  };
  const classes = useStyles();
  return (
    <div className={classes.sectionSections}>
      <div className={classes.container}>
        <GridContainer justifyContent="center">
          <GridItem
            md={8}
            className={classNames(classes.mrAuto, classes.mlAuto)}
          >
            <div className={classes.sectionDescription}>
              <h2 className={classes.title}>Checkout Some of our Amazing Shops</h2>
              <h5 className={classes.description}>
                No mater what you are looking for our Sellers have you covered.
                RWA to RWI F4cet Marketplace will become your only place to shop
                for Solana based real world assets and items. 
              </h5>
              <Link href={"/sections"}>
                <Button
                  color="rose"
                  target="_blank"
                  className={classes.navButton}
                  round
                >
                  view all sections
                </Button>
              </Link>
            </div>
          </GridItem>
        </GridContainer>
      </div>
      <div className={classes.containerFluid}>
        {renderContainerFluid(classes.photoGallery)}
      </div>
    </div>
  );
}
