/**
=========================================================
F4cets Marketplace - Presentation Page
=========================================================

Product Page: https://www.f4cets.market/
Copyright 2023 F4cets Team
Built with NextJS Material Kit PRO
=========================================================
*/

import React, { useEffect, useRef } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import classNames from "classnames";
import makeStyles from "@mui/styles/makeStyles";
import { motion } from "framer-motion";

// core components
import Header from "/components/Header/Header.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import Parallax from "/components/Parallax/Parallax.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Button from "/components/CustomButtons/Button.js";
import Card from "/components/Card/Card.js";
import CardHeader from "/components/Card/CardHeader.js";
import CardBody from "/components/Card/CardBody.js";
import Icon from "@mui/material/Icon";
import Subject from "@mui/icons-material/Subject";

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Lottie animation
import swipeAnimation from "/public/lottie/swipe-animation.json";

// Styles
import presentationStyle from "/styles/jss/nextjs-material-kit-pro/pages/presentationStyle.js";
import cardsStyle from "/styles/jss/nextjs-material-kit-pro/pages/componentsSections/sectionCards.js";

// Custom styles for logo, video, header, and sections
const useStyles = makeStyles({
  ...presentationStyle,
  ...cardsStyle,
  logo: {
    width: "30vw",
    height: "auto",
    maxWidth: "100%",
  },
  videoParallax: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.7,
  },
  section: {
    padding: "70px 0",
    textAlign: "center",
  },
  reducedPaddingSection: {
    padding: "70px 0 40px 0", // Reduced bottom padding for some sections
    textAlign: "center",
  },
  tightPaddingSection: {
    padding: "70px 0 20px 0", // Tighter bottom padding for tech stack
    textAlign: "center",
  },
  commerceSection: {
    textAlign: "left", // Left-justify text
  },
  centeredSection: {
    textAlign: "center", // Center text for specific sections
  },
  commerceTitle: {
    fontFamily: "'Quicksand', sans-serif",
    fontSize: "3rem", // Big title
    fontWeight: 700,
    lineHeight: "1.4", // Taller appearance
    marginBottom: "20px",
    color: "#2b2634 !important", // Updated from #212121
    hyphens: "none", // Prevent word breaking
    wordBreak: "normal", // Ensure whole words wrap
    overflowWrap: "anywhere", // Allow wrapping at any point if needed
    "@media (max-width: 576px)": {
      fontSize: "1.8rem !important", // Smaller on mobile
    },
  },
  commerceDescription: {
    fontFamily: "'Quicksand', sans-serif",
    fontSize: "1.8rem", // Taller text
    fontWeight: 500,
    lineHeight: "1.6", // Taller appearance
    color: "#2b2634 !important", // Updated from #212121
    hyphens: "none", // Prevent word breaking
    wordBreak: "normal", // Ensure whole words wrap
    overflowWrap: "anywhere", // Allow wrapping at any point if needed
    "@media (max-width: 576px)": {
      fontSize: "1.1rem !important", // Smaller on mobile
    },
  },
  brand: {
    color: "#fff", // Hero text color
    textAlign: "center", // Center all content
    "@media (min-width: 960px)": { // Desktop
      textAlign: "left",
    },
    "& h1": {
      fontFamily: "'Quicksand', sans-serif",
      fontSize: "4.8rem",
      fontWeight: 700,
      display: "inline-block",
      position: "relative",
      "@media (max-width: 960px)": {
        fontSize: "2.4rem",
        lineHeight: "1.2",
        display: "none", // Hide title on mobile
      },
    },
    "& h3": {
      fontFamily: "'Quicksand', sans-serif",
      fontSize: "1.5rem",
      fontWeight: 500,
      maxWidth: "600px",
      margin: "10px 0 20px", // Increased bottom margin
      wordWrap: "break-word",
      whiteSpace: "normal", // Ensure text wraps correctly
      color: "#fff !important", // Enforce white color
      "@media (max-width: 576px)": {
        fontSize: "1.2rem", // Slightly smaller for fit
        maxWidth: "100%", // Full width for centering
        margin: "10px auto", // Balanced spacing
        lineHeight: "1.2", // Tighter line height
        display: "block", // Stack vertically
        textAlign: "center", // Center text
      },
    },
  },
  solanaIcon: {
    width: "40px",
    height: "40px",
    verticalAlign: "middle",
    marginLeft: "4px",
    "@media (max-width: 576px)": {
      width: "25px", // Smaller on mobile
      height: "25px",
    },
  },
  builtOnWrapper: {
    display: "inline-flex",
    alignItems: "center",
    "@media (max-width: 576px)": {
      display: "inline-flex",
      alignItems: "center",
    },
  },
  buttonWrapper: {
    marginTop: "20px",
    "@media (max-width: 576px)": {
      marginTop: "10px", // Closer to subtitle
      display: "flex",
      justifyContent: "center", // Center button
    },
  },
  cardContainer: {
    display: "flex",
    flexWrap: "nowrap", // Side by side on desktop
    justifyContent: "center",
    gap: "20px", // Space between cards
    padding: "0 10px", // Padding to prevent edge clipping
    "@media (min-width: 960px)": {
      "&:hover .motion-card": {
        transform: "scale(1.05)", // Pop animation on desktop hover
        transition: "transform 0.3s ease",
      },
    },
    "@media (max-width: 960px)": {
      flexWrap: "nowrap", // Horizontal scroll on mobile
      overflowX: "auto",
      scrollSnapType: "x mandatory", // Snap to each card
      scrollBehavior: "smooth", // Smooth scrolling
      padding: "0 10px", // Consistent padding
      "&::-webkit-scrollbar": {
        display: "none", // Hide scrollbar
      },
    },
  },
  cardItem: {
    flex: "0 0 auto",
    scrollSnapAlign: "start", // Snap to start of each card
    margin: "0 auto", // Center cards
    "@media (max-width: 960px)": {
      width: "calc(90vw - 20px)", // Dynamic width based on viewport
      maxWidth: "320px", // Cap width for consistency
    },
  },
  backgroundCard: {
    position: "relative",
    overflow: "hidden",
    "@media (min-width: 960px)": {
      "& .card-content": {
        opacity: "0",
        transition: "opacity 0.3s ease",
      },
      "&:hover .card-content": {
        opacity: "1",
      },
    },
    "@media (max-width: 960px)": {
      "& .card-content": {
        opacity: "1",
      },
    },
  },
  ctaSection: {
    textAlign: "center", // Center text and button
    marginBottom: "50px", // Extra space from page bottom
  },
  ctaButtonWrapper: {
    marginTop: "20px",
    paddingBottom: "30px", // Extra padding below button
  },
  entrepreneurCard: {
    backgroundColor: "#fff",
    boxShadow: "0 8px 16px rgba(0,0,0,0.2)", // Strong shadow for floating effect
    padding: "30px",
    textAlign: "center",
    borderRadius: "12px",
    "@media (max-width: 576px)": {
      padding: "20px", // Reduced padding on mobile
    },
  },
  swipeAnimation: {
    display: "none", // Hidden on desktop
    "@media (max-width: 960px)": {
      display: "block", // Visible on mobile
      width: "200px",
      height: "100px",
      margin: "1px auto", // Tighter margin for proximity
    },
  },
});

export default function PresentationPage() {
  const cardContainerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;

    // Scroll-triggered animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll(".animate-section").forEach((section) => {
      observer.observe(section);
    });

    // Force scroll to first card on mobile
    if (window.innerWidth < 960 && cardContainerRef.current) {
      setTimeout(() => {
        cardContainerRef.current.scrollLeft = 0;
      }, 100); // Delay to ensure DOM is rendered
    }

    // Rotating card styles
    const addStylesForRotatingCards = () => {
      var rotatingCards = document.getElementsByClassName(classes.cardRotate);
      for (let i = 0; i < rotatingCards.length; i++) {
        var rotatingCard = rotatingCards[i];
        var cardFront = rotatingCard.getElementsByClassName(classes.front)[0];
        var cardBack = rotatingCard.getElementsByClassName(classes.back)[0];
        cardFront.style.height = "unset";
        cardFront.style.width = "unset";
        cardBack.style.height = "unset";
        cardBack.style.width = "unset";
        var rotatingWrapper = rotatingCard.parentElement;
        var cardWidth = rotatingWrapper.offsetWidth;
        var cardHeight = rotatingCard.children[0].children[0].offsetHeight;
        rotatingWrapper.style.height = cardHeight + "px";
        rotatingWrapper.style["margin-bottom"] = 30 + "px";
        cardFront.style.height = cardHeight + 35 + "px";
        cardFront.style.width = cardWidth + "px";
        cardBack.style.height = cardHeight + 35 + "px";
        cardBack.style.width = cardWidth + "px";
      }
    };
    addStylesForRotatingCards();

    return () => observer.disconnect();
  }, []);

  const classes = useStyles();

  // Framer Motion variants for button (no glow, transparent container)
  const buttonVariants = {
    rest: {
      scale: 1,
      transition: { duration: 0.3 }
    },
    hover: {
      scale: 1.1,
      rotate: [0, 5, -5, 5, 0],
      transition: {
        scale: { duration: 0.2 },
        rotate: { repeat: 1, duration: 0.5 },
      },
    },
  };

  // Framer Motion variants for card hover (small pop on desktop)
  const cardVariants = {
    rest: { scale: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <div>
      <Head>
        <title>F4cets Marketplace - Web3 E-Commerce on Solana</title>
        <meta
          name="description"
          content="Discover F4cets, a decentralized marketplace built on Solana. Shop, sell, and earn crypto cashback - Solflare Preferred Wallet Provider for F4cet."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&family=Roboto+Slab:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Header
        brand={<img src="/img/f4cet-logo.png" alt="F4cets MarketPlace" className={classes.logo} />}
        links={<HeaderLinks dropdownHoverColor="info" />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 400,
          color: "white",
        }}
      />

      {/* Hero Section with Video */}
      <Parallax className={classes.parallax}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className={classes.videoParallax}
        >
          <source src="/img/f4cets-hero.mp4" type="video/mp4" />
          <img src="/img/hero-fallback.jpg" alt="F4cets Marketplace Hero" />
        </video>
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}>
                <h1>
                  F4cets Marketplace
                  <span className={classes.proBadge}>PRO</span>
                </h1>
                <h3 className={classes.title}>
                  Where Crypto Meets Commerce -{" "}
                  <span className={classes.builtOnWrapper}>
                    <span>Built on</span>{" "}
                    <img
                      src="/img/solana-icon.png"
                      alt="Solana Icon"
                      className={classes.solanaIcon}
                    />
                  </span>
                </h3>
                <div className={classes.buttonWrapper}>
                  <motion.button
                    variants={buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    style={{
                      zIndex: 20,
                      position: "relative",
                      display: "inline-block",
                      maxWidth: "200px",
                      background: "transparent",
                      border: "none",
                      boxShadow: "none",
                      padding: 0,
                    }}
                  >
                    <Button
                      href="/marketplace"
                      round
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontWeight: "bold",
                        borderRadius: "12px",
                        border: "none",
                        background: "linear-gradient(45deg, #e91e63 30%, #ec407a 90%)",
                        "&:hover": {
                          background: "linear-gradient(45deg, #d81b60 30%, #f06292 90%)",
                        },
                        width: "100%",
                        color: "#fff",
                        boxShadow: "none",
                      }}
                    >
                      Start for Free
                    </Button>
                  </motion.button>
                </div>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

      <div className={classNames(classes.main, classes.mainRaised)}>
        {/* Commerce Platform Section */}
        <div className={classes.reducedPaddingSection}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} className={classes.commerceSection}>
                <h2 className={classes.commerceTitle}>
                  The only web3 commerce platform you need.
                </h2>
                <p className={classes.commerceDescription}>
                  Reach local and global markets. Offer direct and wholesale options. Sell online and in person. Connect on mobile, desktop, or in Solflare explore.
                </p>
              </GridItem>
            </GridContainer>
          </div>
        </div>

        {/* Profile Cards Section */}
        <div className={classes.section + " animate-section"} style={{ backgroundColor: "transparent" }}>
          <div className={classes.container}>
            <div className={classes.cardContainer} ref={cardContainerRef}>
              <div className={classes.cardItem}>
                <motion.div className="motion-card" variants={cardVariants} initial="rest" whileHover="hover">
                  <a href="/marketplace">
                    <Card profile style={{ maxWidth: "360px" }}>
                      <CardHeader image>
                        <img
                          src="/img/examples/mobile.png"
                          alt="Mobile Interface"
                        />
                        <div
                          className={classes.coloredShadow}
                          style={{
                            backgroundImage: `url(/img/examples/mobile.png)`,
                            opacity: "1",
                          }}
                        />
                      </CardHeader>
                      <CardBody>
                        <h4 className={classes.cardTitle}>Mobile Browser</h4>
                        <h6 className={`${classes.cardCategory} ${classes.cardDescription}`}>
                          Brave Browser with your Sol Wallet
                        </h6>
                      </CardBody>
                    </Card>
                  </a>
                </motion.div>
              </div>
              <div className={classes.cardItem}>
                <motion.div className="motion-card" variants={cardVariants} initial="rest" whileHover="hover">
                  <a href="/marketplace">
                    <Card profile style={{ maxWidth: "360px" }}>
                      <CardHeader image>
                        <img
                          src="/img/examples/desktop.png"
                          alt="Desktop Interface"
                        />
                        <div
                          className={classes.coloredShadow}
                          style={{
                            backgroundImage: `url(/img/examples/desktop.png)`,
                            opacity: "1",
                          }}
                        />
                      </CardHeader>
                      <CardBody>
                        <h4 className={classes.cardTitle}>Desktop Browser</h4>
                        <h6 className={`${classes.cardCategory} ${classes.cardDescription}`}>
                          Use any browser with Sol wallet
                        </h6>
                      </CardBody>
                    </Card>
                  </a>
                </motion.div>
              </div>
              <div className={classes.cardItem}>
                <motion.div className="motion-card" variants={cardVariants} initial="rest" whileHover="hover">
                  <a href="/marketplace">
                    <Card profile style={{ maxWidth: "360px" }}>
                      <CardHeader image>
                        <img
                          src="/img/examples/solfd.png"
                          alt="Solana F4cet"
                        />
                        <div
                          className={classes.coloredShadow}
                          style={{
                            backgroundImage: `url(/img/examples/solfd.png)`,
                            opacity: "1",
                          }}
                        />
                      </CardHeader>
                      <CardBody>
                        <h4 className={classes.cardTitle}>Solflare</h4>
                        <h6 className={`${classes.cardCategory} ${classes.cardDescription}`}>
                          Solflare wallet explore
                        </h6>
                      </CardBody>
                    </Card>
                  </a>
                </motion.div>
              </div>
            </div>
            <Lottie
              animationData={swipeAnimation}
              loop={true}
              className={classes.swipeAnimation}
            />
          </div>
        </div>

        {/* Entrepreneurs Card Section */}
        <div className={classes.section + " animate-section"}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12}>
                <Card className={classes.entrepreneurCard}>
                  <CardBody>
                    <h2 className={classes.commerceTitle}>
                      Entrepreneurs to enterprise, F4cet is for everyone
                    </h2>
                    <p className={classes.commerceDescription}>
                      Build fast, dream big, and grow now on F4cet.
                    </p>
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </div>

        {/* Join the F4cets Community Section */}
        <div className={classes.section + " animate-section"} style={{ backgroundColor: "transparent" }}>
          <div className={classes.container}>
            <h2 className={classes.commerceTitle}>Join the F4cets Community</h2>
            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <div className={classes.rotatingCardContainer}>
                  <Card background className={classes.cardRotate}>
                    <div
                      className={`${classes.front} ${classes.wrapperBackground}`}
                      style={{
                        backgroundImage: "url('/img/examples/marketplace.png')",
                      }}
                    >
                      <CardBody background className={classes.cardBodyRotate}>
                        <h4 className={classes.cardCategoryWhite}>Buyers</h4>
                        <a href="/marketplace" onClick={(e) => e.preventDefault()}>
                          <h3 className={classes.cardTitleWhite}>Shop with Crypto</h3>
                        </a>
                        <h4 className={classes.cardDescriptionWhite}>
                          Shop our diverse marketplace with fast, secure transactions on F4cet powered by Solana.
                        </h4>
                      </CardBody>
                    </div>
                    <div
                      className={`${classes.back} ${classes.wrapperBackground}`}
                      style={{
                        backgroundImage: "url('/img/examples/marketplace.png')",
                      }}
                    >
                      <CardBody background className={classes.cardBodyRotate}>
                        <h4 className={classes.cardTitleWhite}>Start Shopping</h4>
                        <h4 className={classes.cardDescriptionWhite}>
                          Browse and buy with ease using Solana’s fast and secure blockchain.
                        </h4>
                        <div className={classes.textCenter}>
                          <Button round justIcon color="info" href="/marketplace">
                            <Subject />
                          </Button>
                        </div>
                      </CardBody>
                    </div>
                  </Card>
                </div>
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <div className={classes.rotatingCardContainer}>
                  <Card background className={classes.cardRotate}>
                    <div
                      className={`${classes.front} ${classes.wrapperBackground}`}
                      style={{
                        backgroundImage: "url('/img/examples/seller.png')",
                      }}
                    >
                      <CardBody background className={classes.cardBodyRotate}>
                        <h4 className={classes.cardCategoryWhite}>Sellers</h4>
                        <a href="/dashboards/onboarding" onClick={(e) => e.preventDefault()}>
                          <h3 className={classes.cardTitleWhite}>Sell Globally</h3>
                        </a>
                        <h4 className={classes.cardDescriptionWhite}>
                          Create your store, manage inventory, and reach global customers with our intuitive dashboard built on Solana.
                        </h4>
                      </CardBody>
                    </div>
                    <div
                      className={`${classes.back} ${classes.wrapperBackground}`}
                      style={{
                        backgroundImage: "url('/img/examples/seller.png')",
                      }}
                    >
                      <CardBody background className={classes.cardBodyRotate}>
                        <h4 className={classes.cardTitleWhite}>Become a Seller</h4>
                        <h4 className={classes.cardDescriptionWhite}>
                          Set up your store and start selling in minutes with F4cets.
                        </h4>
                        <div className={classes.textCenter}>
                          <Button round justIcon color="info" href="/marketplace">
                            <Subject />
                          </Button>
                        </div>
                      </CardBody>
                    </div>
                  </Card>
                </div>
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <div className={classes.rotatingCardContainer}>
                  <Card background className={classes.cardRotate}>
                    <div
                      className={`${classes.front} ${classes.wrapperBackground}`}
                      style={{
                        backgroundImage: "url('/img/examples/af.png')",
                      }}
                    >
                      <CardBody background className={classes.cardBodyRotate}>
                        <h4 className={classes.cardCategoryWhite}>Affiliates</h4>
                        <a href="/affiliate" onClick={(e) => e.preventDefault()}>
                          <h3 className={classes.cardTitleWhite}>Earn Rewards</h3>
                        </a>
                        <h4 className={classes.cardDescriptionWhite}>
                          Shop with our web2 affiliates and earn up to 85% crypto cashback on purchases, powered by top affiliates.
                        </h4>
                      </CardBody>
                    </div>
                    <div
                      className={`${classes.back} ${classes.wrapperBackground}`}
                      style={{
                        backgroundImage: "url('/img/examples/af.png')",
                      }}
                    >
                      <CardBody background className={classes.cardBodyRotate}>
                        <h5 className={classes.cardTitleWhite}>Join Affiliates</h5>
                        <h4 className={classes.cardDescriptionWhite}>
                          Shop with top brands and earn crypto rewards.
                        </h4>
                        <div className={classes.textCenter}>
                          <Button round justIcon color="info" href="/affiliate">
                            <Subject />
                          </Button>
                        </div>
                      </CardBody>
                    </div>
                  </Card>
                </div>
              </GridItem>
            </GridContainer>
          </div>
        </div>

        {/* Web3 Technology Stack Section */}
        <div className={classes.tightPaddingSection}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} className={classes.centeredSection}>
                <h2 className={classes.commerceTitle}>
                  There’s no better place for you to build
                </h2>
                <p className={classes.commerceDescription}>
                  Solana, MetaPlex, & Solflare powering everything on F4cet since day one.
                </p>
              </GridItem>
            </GridContainer>
          </div>
        </div>

        {/* Technology Benefits Cards Section */}
        <div className={classes.section + " animate-section"} style={{ backgroundColor: "transparent" }}>
          <div className={classes.container}>
            <div className={classes.cardContainer}>
              <div className={classes.cardItem}>
                <motion.div className="motion-card" variants={cardVariants} initial="rest" whileHover="hover">
                  <Card
                    background
                    className={classes.backgroundCard}
                    style={{
                      backgroundImage: "url('/img/examples/solana.png')",
                    }}
                  >
                    <CardBody background>
                      <div className="card-content">
                        <h4 className={classes.cardCategoryWhite}>DECENTRALIZED COMMERCE</h4>
                        <a href="/marketplace" onClick={(e) => e.preventDefault()}>
                          <h3 className={classes.cardTitleWhite}>Shop Securely with F4cets</h3>
                        </a>
                        <h4 className={classes.cardDescriptionWhite}>
                          Experience fast, low-cost transactions powered by Solana’s blockchain for a seamless shopping experience. Solana Preferred blockchain on F4cets.market
                        </h4>
                        <Button simple color="white" href="/marketplace">
                          <Subject /> Start Shopping
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              </div>
              <div className={classes.cardItem}>
                <motion.div className="motion-card" variants={cardVariants} initial="rest" whileHover="hover">
                  <Card
                    background
                    className={classes.backgroundCard}
                    style={{
                      backgroundImage: "url('/img/examples/meta.png')",
                    }}
                  >
                    <CardBody background>
                      <div className="card-content">
                        <h4 className={classes.cardCategoryWhite}>NFT RECEIPTS</h4>
                        <a href="/about" onClick={(e) => e.preventDefault()}>
                          <h3 className={classes.cardTitleWhite}>Own Your Purchases</h3>
                        </a>
                        <h4 className={classes.cardDescriptionWhite}>
                          Every purchase comes with a dynamic MetaPlex Core NFT receipt, securely managed by F4cet, proving ownership. Metaplex Preferred protocol provider on F4cets.market
                        </h4>
                        <Button simple color="white" href="/marketplace">
                          <Subject /> Check it out
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              </div>
              <div className={classes.cardItem}>
                <motion.div className="motion-card" variants={cardVariants} initial="rest" whileHover="hover">
                  <Card
                    background
                    className={classes.backgroundCard}
                    style={{
                      backgroundImage: "url('/img/examples/solf.png')",
                    }}
                  >
                    <CardBody background>
                      <div className="card-content">
                        <h4 className={classes.cardCategoryWhite}>CRYPTO CASHBACK</h4>
                        <a href="/affiliate" onClick={(e) => e.preventDefault()}>
                          <h3 className={classes.cardTitleWhite}>Earn Rewards with Affiliates</h3>
                        </a>
                        <h4 className={classes.cardDescriptionWhite}>
                          Shop through our affiliate program and earn up to 85% crypto cashback dropped into your Solflare wallet. Solflare - Preferred wallet provider on F4cets.market
                        </h4>
                        <Button simple color="white" href="/affiliate">
                          <Subject /> Shop Affiliates
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              </div>
            </div>
            <Lottie
              animationData={swipeAnimation}
              loop={true}
              className={classes.swipeAnimation}
            />
          </div>
        </div>

        {/* Call to Action Section */}
        <div className={classes.section + " animate-section ctaSection"}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12}>
                <h2 className={classes.commerceTitle}>
                  Start buying or selling in no time.
                </h2>
                <p className={classes.commerceDescription}>
                  Buyers, sellers, and affiliates... the F4cets web3 world waits...
                </p>
                <div className={classes.ctaButtonWrapper}>
                  <motion.button
                    variants={buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    style={{
                      zIndex: 20,
                      position: "relative",
                      display: "inline-block",
                      maxWidth: "200px",
                      background: "transparent",
                      border: "none",
                      boxShadow: "none",
                      padding: 0,
                    }}
                  >
                    <Button
                      href="/marketplace"
                      round
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontWeight: "bold",
                        borderRadius: "12px",
                        border: "none",
                        background: "linear-gradient(45deg, #e91e63 30%, #ec407a 90%)",
                        "&:hover": {
                          background: "linear-gradient(45deg, #d81b60 30%, #f06292 90%)",
                        },
                        width: "100%",
                        color: "#fff",
                        boxShadow: "none",
                      }}
                    >
                      Waiting is Over
                    </Button>
                  </motion.button>
                </div>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// CSS for animations and font
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-section {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }
  .animate-section.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  *:not(.fab) {
    font-family: 'Quicksand', sans-serif !important;
  }
`;

// Inject styles
if (typeof window !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}