import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import makeStyles from "@mui/styles/makeStyles";
// @material-ui icons
import Close from "@mui/icons-material/Close";
import Check from "@mui/icons-material/Check";
// core components
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Card from "/components/Card/Card.js";
import CardBody from "/components/Card/CardBody.js";
import Button from "/components/CustomButtons/Button.js";

import freeDemoStyle from "/styles/jss/nextjs-material-kit-pro/pages/presentationSections/freeDemoStyle.js";

const useStyles = makeStyles(freeDemoStyle);

export default function SectionFreeDemo() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <div className={classes.container}>
        <GridContainer justifyContent="center">
          <GridItem
            md={5}
            sm={8}
            className={classes.mlAuto + " " + classes.mrAuto}
          >
            <div className={classes.iconGithub}>
              <div className="fab fa-github" />
            </div>
            <div>
              <h2 className={classes.title}>Why Wait?</h2>
              <h5 className={classes.description}>
                With Solana being the fastest lowest cost blockchain Why
                wait?  There is no obligation to sell even if you have 
                created your marketplace.  No harm in seeing how it works.
                Will just cost a tiny amount of SOL. 
              </h5>
            </div>
            <Button
              href="https://www.f4cets.com/collections"
              color="rose"
              target="_blank"
              round
            >
              Start Selling Today
            </Button>
          </GridItem>
          <GridItem md={6} sm={12} className={classes.mlAuto}>
            <GridContainer>
              <GridItem md={6} sm={6}>
                <Card className={classNames(classes.card, classes.cardPricing)}>
                  <CardBody>
                    <h3 className={classes.cardTitle}>Competitors</h3>
                    <ul>
                      <li>
                        <b>2</b> Minting
                      </li>
                      <li>
                        <b>1</b> Minting Pages
                      </li>
                      <li>
                        <Close
                          className={classNames(
                            classes.cardIcons,
                            classes.dangerColor
                          )}
                        />{" "}
                        RWA NFTs
                      </li>
                      <li>
                        <Close
                          className={classNames(
                            classes.cardIcons,
                            classes.dangerColor
                          )}
                        />{" "}
                        MarketPlace
                      </li>
                      <li>
                        <Close
                          className={classNames(
                            classes.cardIcons,
                            classes.dangerColor
                          )}
                        />{" "}
                        MarketPlace 4 Prototype
                      </li>
                      <li>
                        <Close
                          className={classNames(
                            classes.cardIcons,
                            classes.dangerColor
                          )}
                        />{" "}
                        Click2Launch
                      </li>
                    </ul>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem md={6} sm={6}>
                <Card className={classNames(classes.card, classes.cardPricing)}>
                  <CardBody>
                    <h3 className={classes.cardTitle}>F4cet PRO</h3>
                    <ul>
                      <li>
                        <b>1000+</b> Minting
                      </li>
                      <li>
                        <b>Unlimited</b> Minting Pages
                      </li>
                      <li>
                        <Check
                          className={classNames(
                            classes.cardIcons,
                            classes.successColor
                          )}
                        />{" "}
                        RWA NFTs
                      </li>
                      <li>
                        <Check
                          className={classNames(
                            classes.cardIcons,
                            classes.successColor
                          )}
                        />{" "}
                        MarketPlaces
                      </li>
                      <li>
                        <Check
                          className={classNames(
                            classes.cardIcons,
                            classes.successColor
                          )}
                        />{" "}
                        MarketPlace 4 Prototype
                      </li>
                      <li>
                        <Check
                          className={classNames(
                            classes.cardIcons,
                            classes.successColor
                          )}
                        />{" "}
                        Click2Launch
                      </li>
                    </ul>
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
