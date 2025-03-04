/*eslint-disable*/
import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import makeStyles from '@mui/styles/makeStyles';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
// core components
import Header from "/components/Header/Header.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import Parallax from "/components/Parallax/Parallax.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Button from "/components/CustomButtons/Button.js";
// sections for this page
import SectionDescription from "/pages-sections/presentation-page/SectionDescription.js";
import SectionComponents from "/pages-sections/presentation-page/SectionComponents.js";
import SectionCards from "/pages-sections/presentation-page/SectionCards.js";
import SectionContent from "/pages-sections/presentation-page/SectionContent.js";
import SectionSections from "/pages-sections/presentation-page/SectionSections.js";
import SectionExamples from "/pages-sections/presentation-page/SectionExamples.js";
import SectionFreeDemo from "/pages-sections/presentation-page/SectionFreeDemo.js";
import SectionOverview from "/pages-sections/presentation-page/SectionOverview.js";
import SectionPricing from "/pages-sections/presentation-page/SectionPricing.js";

import presentationStyle from "/styles/jss/nextjs-material-kit-pro/pages/presentationStyle.js";

const useStyles = makeStyles(presentationStyle);

// Add custom styles for the logo
const useLogoStyles = makeStyles({
  logo: {
    width: "30vw", // 30% of viewport width
    height: "auto", // Maintain aspect ratio
    maxWidth: "100%", // Ensure it doesn’t overflow on small screens
  },
});

export default function PresentationPage() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  const classes = useStyles();
  const logoClasses = useLogoStyles(); // Custom styles for logo

  return (
    <div>
      <Header
        brand={<img src="/img/f4cet-logo.png" alt="F4cets MarketPlace" className={logoClasses.logo} />}
        links={<HeaderLinks dropdownHoverColor="info" />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 400,
          color: "info"
        }}
      />
      <Parallax image="/img/nextjs_header.jpg" className={classes.parallax}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}>
                <h1>
                  F4cets MarketPlace
                  <span className={classes.proBadge}>PRO</span>
                </h1>
                <h3 className={classes.title}>
                  Buy, Mint, Sell RWA NFTs with the touch of a button.
                </h3>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <SectionDescription />
        <SectionComponents />
        <SectionCards />
        <SectionContent />
        <SectionSections />
        <SectionExamples />
        <SectionFreeDemo />
        <SectionOverview />
      </div>
      <SectionPricing />
    </div>
  );
}