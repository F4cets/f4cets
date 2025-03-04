import React from "react";
// core components
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import makeStyles from "@mui/styles/makeStyles";
// library used for cool animations
import ScrollAnimation from "react-animate-on-scroll";

import contentStyle from "/styles/jss/nextjs-material-kit-pro/pages/presentationSections/contentStyle.js";

const useStyles = makeStyles(contentStyle);

export default function SectionContent() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <div className={classes.container}>
        <GridContainer justifyContent="center">
          <GridItem md={4}>
            <div className={classes.sectionDescription}>
              <h3 className={classes.title}>Seller Shops</h3>
              <h6 className={classes.description}>
                For Areas that Need More Space
              </h6>
              <h5 className={classes.description}>
                Wondering about the our shop space? Simple, Clean, Beautiful
                We want your buyers to fall in love with your RWA so you 
                do not have to worry about anything else. 
                We want the buying process on Solana to be so easy that your
                buyers choose to open their own shops with us in the future.
                We have a beautiful Seller admin dashboard that allows you 
                to keep up to date on inventory, purchases, and delivered RWA.
                We make it simple to create new inventory and add more RWI as 
                well.  We strive to keep to our word.
                Simple, Clean, Beautiful{" "}
              </h5>
            </div>
          </GridItem>
          <GridItem md={7} className={classes.mlAuto}>
            <div className={classes.imageContainer}>
              <div className={classes.animeAreaImg}>
                <ScrollAnimation animateIn="fadeInUp">
                  <img
                    src="/img/assets-for-demo/presentationViewSectionComponent/ipad-comments.jpg"
                    alt="iPad comments"
                    className={classes.areaImg}
                  />
                </ScrollAnimation>
              </div>
              <div className={classes.animeInfoImg}>
                <ScrollAnimation animateIn="fadeInUp">
                  <img
                    src="/img/assets-for-demo/presentationViewSectionComponent/ipad-table.jpg"
                    alt="iPad table"
                    className={classes.infoImg}
                  />
                </ScrollAnimation>
              </div>
              <img
                className={classes.ipadImg}
                src="/img/assets-for-demo/presentationViewSectionComponent/presentation-ipad.jpg"
                alt="iPad"
              />
            </div>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
