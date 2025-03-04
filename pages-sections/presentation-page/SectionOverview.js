import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// core components
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import InfoArea from "/components/InfoArea/InfoArea.js";
import Card from "/components/Card/Card.js";
import CardHeader from "/components/Card/CardHeader.js";
import CardBody from "/components/Card/CardBody.js";
// @material-ui icons
import Grid from "@mui/icons-material/GridOn";
import PhoneLink from "@mui/icons-material/Phonelink";
import AccessTime from "@mui/icons-material/AccessTime";
import AttachMoney from "@mui/icons-material/AttachMoney";
import makeStyles from "@mui/styles/makeStyles";

import overviewStyle from "/styles/jss/nextjs-material-kit-pro/pages/presentationSections/overviewStyle.js";

const useStyles = makeStyles(overviewStyle);

export default function SectionOverview() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <div
        className={classes.features5}
        style={{
          backgroundImage: "url('/img/assets-for-demo/features-5.jpg')",
        }}
      >
        <GridItem md={8} className={classNames(classes.mlAuto, classes.mrAuto)}>
          <h2 className={classes.title}>F4cet makes it easy for Buyers and Sellers to connect</h2>
        </GridItem>
        <div className={classes.container}>
          <GridContainer justifyContent="center">
            <GridItem sm={3} className={classes.featuresShow}>
              <InfoArea
                title="Sellers Listing"
                description={
                  <p>
                    Once your shop is live on F4cet and Solana buyers will be 
                    able to find you instantly and become buyers in seconds.
                  </p>
                }
                icon={Grid}
                iconColor="gray"
                vertical={true}
              />
            </GridItem>
            <GridItem sm={3} className={classes.featuresShow}>
              <InfoArea
                title="Desktop/Mobile"
                description={
                  <p>
                    F4cet Marketplace is designed to be used everywhere at 
                    anytime.  We don't let devices stop your sales.
                    Never have... Never will...
                  </p>
                }
                icon={PhoneLink}
                iconColor="gray"
                vertical={true}
              />
            </GridItem>
            <GridItem sm={3} className={classes.featuresShow}>
              <InfoArea
                title="Save Time"
                description={
                  <p>
                    Using F4cet, both buyers and sellers save time with the 
                    transaction speeds of Solana, and our cloudbased processing.
                  </p>
                }
                icon={AccessTime}
                iconColor="gray"
                vertical={true}
              />
            </GridItem>
            <GridItem sm={3} className={classes.featuresShow}>
              <InfoArea
                title="Save Money"
                description={
                  <p>
                    We all are about saving time, but saving money is even better.
                    Buyers get better pricing from sellers using F4cet and Solana.
                    Say bye bye to credit card fees.
                  </p>
                }
                icon={AttachMoney}
                iconColor="gray"
                vertical={true}
              />
            </GridItem>
          </GridContainer>
        </div>
      </div>
      <div className={classes.sectionTestimonials}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem
              md={8}
              className={classNames(classes.mlAuto, classes.mrAuto)}
            >
              <h2 className={classes.title}>Trusted by 1,000+ Sellers</h2>
              <h5 className={classes.description}>
                Buyers and Sellers alike love F4cet Marketplace with our direct
                integration with Solana, and RWA Core NFTs. Do not take our word for it. 
                We love reviews and feedback.
              </h5>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={4} sm={4}>
              <Card plain profile>
                <GridContainer>
                  <GridItem md={3} sm={3}>
                    <CardHeader image plain>
                      <a href="#pablo">
                        <img src="/img/assets-for-demo/test1.jpg" alt="..." />
                      </a>
                      <div
                        className={classes.coloredShadow}
                        style={{
                          backgroundImage:
                            "url('/img/assets-for-demo/test1.jpg')",
                          opacity: "1",
                        }}
                      />
                      <div
                        className={classes.coloredShadow}
                        style={{
                          backgroundImage:
                            "url('/img/assets-for-demo/test1.jpg')",
                          opacity: "1",
                        }}
                      />
                    </CardHeader>
                  </GridItem>
                  <GridItem md={9} sm={9}>
                    <CardBody plain className={classes.alignLeft}>
                      <h4 className={classes.cardTitle}>Khaldi Yass</h4>
                      <p className={classes.cardDescription}>
                        {'"'}As soon as I saw this marketplace, everything else isn
                        {"'"}t the same anymore, I just can{"'"}t describe it
                        guys! Thank you for this work and what you have done for solana!{'"'}
                      </p>
                    </CardBody>
                  </GridItem>
                </GridContainer>
              </Card>
            </GridItem>
            <GridItem md={4} sm={4}>
              <Card plain profile>
                <GridContainer>
                  <GridItem md={3} sm={3}>
                    <CardHeader image plain>
                      <a href="#pablo">
                        <img src="/img/assets-for-demo/test2.jpg" alt="..." />
                      </a>
                      <div
                        className={classes.coloredShadow}
                        style={{
                          backgroundImage:
                            "url('/img/assets-for-demo/test2.jpg')",
                          opacity: "1",
                        }}
                      />
                      <div
                        className={classes.coloredShadow}
                        style={{
                          backgroundImage:
                            "url('/img/assets-for-demo/test2.jpg')",
                          opacity: "1",
                        }}
                      />
                    </CardHeader>
                  </GridItem>
                  <GridItem md={9} sm={9}>
                    <CardBody plain className={classes.alignLeft}>
                      <h4 className={classes.cardTitle}>Josh Murray</h4>
                      <p className={classes.cardDescription}>
                        {'"'}Great tech! Created my own shop and i am 
                        over the moon. Keep up the good work F4cet! 10/10
                        for simplicity, ease of use, and the feel of the entire process.
                        {'"'}
                      </p>
                    </CardBody>
                  </GridItem>
                </GridContainer>
              </Card>
            </GridItem>
            <GridItem md={4} sm={4}>
              <Card plain profile>
                <GridContainer>
                  <GridItem md={3} sm={3}>
                    <CardHeader image plain>
                      <a href="#pablo">
                        <img src="/img/assets-for-demo/test3.jpg" alt="..." />
                      </a>
                      <div
                        className={classes.coloredShadow}
                        style={{
                          backgroundImage:
                            "url('/img/assets-for-demo/test3.jpg')",
                          opacity: "1",
                        }}
                      />
                      <div
                        className={classes.coloredShadow}
                        style={{
                          backgroundImage:
                            "url('/img/assets-for-demo/test3.jpg')",
                          opacity: "1",
                        }}
                      />
                    </CardHeader>
                  </GridItem>
                  <GridItem md={9} sm={9}>
                    <CardBody plain className={classes.alignLeft}>
                      <h4 className={classes.cardTitle}>Michael Onubogu</h4>
                      <p className={classes.cardDescription}>
                        {'"'}Damn Daniel!!! How has something like this never existed? The marketplace is amazing and makes solana fun AF again!
                        Amazing work F4cet team!{'"'}
                      </p>
                    </CardBody>
                  </GridItem>
                </GridContainer>
              </Card>
            </GridItem>
          </GridContainer>
          <div className={classes.ourClients}>
            <GridContainer justifyContent="center">
              <GridItem md={3} sm={3}>
                <img
                  src="/img/assets-for-demo/ourClients/google.png"
                  alt="Google"
                />
              </GridItem>
              <GridItem md={3} sm={3}>
                <img
                  src="/img/assets-for-demo/ourClients/solana.png"
                  alt="solana"
                />
              </GridItem>
              <GridItem md={3} sm={3}>
                <img
                  src="/img/assets-for-demo/ourClients/vercel.png"
                  alt="vercel"
                />
              </GridItem>
              <GridItem md={3} sm={3}>
                <img
                  src="/img/assets-for-demo/ourClients/metaplex.png"
                  alt="metaplex"
                />
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
