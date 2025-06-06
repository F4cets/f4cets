/*eslint-disable*/
import React, { useState, useEffect, useRef, useCallback } from "react";
import classNames from "classnames";
import makeStyles from "@mui/styles/makeStyles";
import Header from "/components/Header/Header.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import Footer from "/components/Footer/Footer.js";
import Parallax from "/components/Parallax/Parallax.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import AffiliateSearchBar from "/components/AffiliateSearchBar/AffiliateSearchBar.js";
import AffiliateCard from "/components/Card/AffiliateCard.js";
import styles from "/styles/jss/nextjs-material-kit-pro/pages/affiliateStyle.js";
import { db } from "../firebase";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUser } from "/contexts/UserContext"; // Import UserContext
import { motion } from "framer-motion";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const useStyles = makeStyles(styles);

export default function Affiliate() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  const classes = useStyles();
  const { connected, publicKey } = useWallet();
  const { user } = useUser(); // Get user from context
  const [affiliates, setAffiliates] = useState([]);
  const [filteredAffiliates, setFilteredAffiliates] = useState([]);
  const [visibleAffiliates, setVisibleAffiliates] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBanned, setShowBanned] = useState(false);
  const loader = useRef(null);

  // Fetch affiliates only when wallet is connected
  useEffect(() => {
    const fetchAffiliates = async () => {
      try {
        console.log("Starting Firestore fetch for affiliates...");
        const affiliatesQuery = query(collection(db, "affiliates"), where("isActive", "==", true));
        console.log("Executing affiliates query...");
        const affiliatesSnapshot = await getDocs(affiliatesQuery);
        console.log("Affiliates fetched:", affiliatesSnapshot.docs.length, "documents");

        const affiliatesData = affiliatesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        affiliatesData.forEach((affiliate) => {
          console.log("Full logoUrl:", affiliate.logoUrl);
        });

        console.log("Affiliates data:", affiliatesData);
        setAffiliates(affiliatesData);
        setFilteredAffiliates(affiliatesData);
        setVisibleAffiliates(affiliatesData.slice(0, 30));
      } catch (error) {
        console.error("Detailed Firestore error for affiliates:", error);
      }
    };
    if (connected && user && user.isActive) {
      fetchAffiliates();
    } else if (connected && user && !user.isActive) {
      setShowBanned(true);
    }
  }, [connected, user]);

  // Track affiliate click
  const trackAffiliateClick = async (affiliate) => {
    if (!user || !publicKey) {
      console.log("No user or wallet connected, skipping click tracking");
      return;
    }
    try {
      const clickId = `${affiliate.id}_${Date.now()}`; // Unique ID for click
      const clickDocRef = doc(db, `users/${user.walletId}/affiliateClicks`, clickId);
      await setDoc(clickDocRef, {
        affiliateId: affiliate.id,
        affiliateName: affiliate.name,
        link: affiliate.affiliateLink,
        timestamp: new Date().toISOString(),
      });
      console.log("Affiliate click tracked:", { walletId: user.walletId, affiliateId: affiliate.id });
    } catch (error) {
      console.error("Error tracking affiliate click:", error);
    }
  };

  const applyFilters = useCallback(async () => {
    try {
      let filtered = [...affiliates];
      if (searchQuery.trim()) {
        const terms = searchQuery.toLowerCase().split(/\s+/).filter((term) => term);
        filtered = filtered.filter((affiliate) => {
          const nameMatch = terms.some((term) =>
            (affiliate.name || "").toLowerCase().includes(term)
          );
          return nameMatch;
        });
      }

      console.log("Filtered affiliates:", filtered);
      setFilteredAffiliates(filtered);
      setVisibleAffiliates(filtered.slice(0, 30));
      setPage(1);
    } catch (error) {
      console.error("Error applying filters for affiliates:", error);
    }
  }, [searchQuery, affiliates]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, applyFilters]);

  const loadMore = useCallback(() => {
    if (connected && visibleAffiliates.length < filteredAffiliates.length) {
      const nextPage = page + 1;
      const newVisibleAffiliates = filteredAffiliates.slice(0, nextPage * 30);
      setVisibleAffiliates(newVisibleAffiliates);
      setPage(nextPage);
    }
  }, [page, filteredAffiliates, visibleAffiliates, connected]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && connected) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loadMore, connected]);

  // Animation variants for the Solflare logo shake effect
  const logoVariants = {
    rest: {
      scale: 1,
      rotate: 0,
      transition: { duration: 0.3 },
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

  return (
    <div>
      <Header
        brand="F4cets Affiliate"
        links={<HeaderLinks dropdownHoverColor="info" />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 300,
          color: "info",
        }}
      />
      <Parallax image="/img/examples/affiliate.jpg" filter={null} small>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            textAlign: "center",
            background: "rgba(0, 0, 0, 0.3)",
          }}
        >
          <div className={classes.brand} style={{ maxWidth: "800px" }}>
            <h1 className={classes.title}>Affiliate Partners!</h1>
            <h4>Earn Upto 85% Crypto Cashback with Our Links – (Cookies Enabled)</h4>
          </div>
        </div>
      </Parallax>

      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classNames(classes.searchContainer, classes.searchPadding)}>
          <AffiliateSearchBar onSearch={handleSearch} searchQuery={searchQuery} />
        </div>
        <div className={classes.grid}>
          {connected && user && user.isActive ? (
            <GridContainer spacing={2} justifyContent="center">
              {visibleAffiliates.length > 0 ? (
                visibleAffiliates.map((affiliate) => (
                  <GridItem key={affiliate.id} xs={12} sm={6} md={4} lg={2}>
                    <AffiliateCard
                      affiliate={affiliate}
                      onClick={() => trackAffiliateClick(affiliate)} // Add click handler
                    />
                  </GridItem>
                ))
              ) : (
                <GridItem>
                  <p>No affiliates found.</p>
                </GridItem>
              )}
              <div ref={loader} style={{ height: "20px" }} />
            </GridContainer>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#212121" }}>
              <style jsx>{`
                #wallet-connect-title {
                  font-size: 2.5rem;
                }
                #preferred-wallet-title {
                  font-size: 2.5rem;
                }
                #new-to-solana-title {
                  font-size: 3rem;
                }
                #download-title {
                  font-size: 3.75rem;
                }
                #solflare-hand-image {
                  max-width: 60%;
                }
                @media (max-width: 576px) {
                  #wallet-connect-title {
                    font-size: 1.3rem;
                  }
                  #preferred-wallet-title {
                    font-size: 1.1rem;
                  }
                  #new-to-solana-title {
                    font-size: 1.1rem;
                  }
                  #download-title {
                    font-size: 1.1rem;
                  }
                  #solflare-hand-image {
                    max-width: 100%;
                  }
                }
              `}</style>
              <h1
                id="wallet-connect-title"
                style={{
                  fontWeight: "bold",
                  marginBottom: "40px",
                  lineHeight: "1.2",
                }}
              >
                Please Connect Your Wallet to View Affiliates
              </h1>
              <GridContainer spacing={3} justifyContent="center">
                {/* First Card */}
                <GridItem xs={12}>
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      padding: "30px 30px 0 30px",
                      borderRadius: "15px",
                      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
                      textAlign: "center",
                      marginBottom: "30px",
                    }}
                  >
                    <h3
                      id="new-to-solana-title"
                      style={{
                        marginBottom: "15px",
                      }}
                    >
                      New to Solana or Crypto?
                    </h3>
                    <h4
                      id="download-title"
                      style={{
                        marginBottom: "20px",
                      }}
                    >
                      Download
                    </h4>
                    <motion.div
                      variants={{
                        rest: {
                          scale: 1,
                          rotate: 0,
                          transition: { duration: 0.3 },
                        },
                        hover: {
                          scale: 1.1,
                          rotate: [0, 5, -5, 5, 0],
                          transition: {
                            scale: { duration: 0.2 },
                            rotate: { repeat: 1, duration: 0.5 },
                          },
                        },
                      }}
                      initial="rest"
                      whileHover="hover"
                    >
                      <a
                        href="https://chromewebstore.google.com/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src="/img/solflare-logo.png"
                          alt="Solflare Logo"
                          style={{
                            width: "100%",
                            maxWidth: "50%",
                            height: "auto",
                            marginBottom: "20px",
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}
                        />
                      </a>
                    </motion.div>
                    <h2
                      id="preferred-wallet-title"
                      style={{
                        marginBottom: "20px",
                      }}
                    >
                      Preferred F4cet Marketplace Wallet
                    </h2>
                    <img
                      src="/img/solflare-m.png"
                      alt="Solflare QR Code"
                      style={{
                        width: "100%",
                        maxWidth: "250px",
                        height: "auto",
                        marginBottom: "20px",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    />
                    <img
                      id="solflare-hand-image"
                      src="/img/solflareH.png"
                      alt="Solflare Hand"
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    />
                  </div>
                </GridItem>
                {/* Second Card */}
                <GridItem xs={12}>
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      padding: "30px",
                      borderRadius: "15px",
                      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
                      textAlign: "center",
                      marginBottom: "30px",
                    }}
                  >
                    <a
                      href="https://chromewebstore.google.com/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="/img/solflareD.png"
                        alt="Solflare Extension"
                        style={{
                          width: "100%",
                          maxWidth: "70%",
                          height: "auto",
                          display: "block",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      />
                    </a>
                  </div>
                </GridItem>
              </GridContainer>
            </div>
          )}
          {/* Add wrapper div with padding below the last row */}
          <div style={{ paddingBottom: "20px" }}></div>
        </div>
      </div>
      <Snackbar
        open={showBanned}
        autoHideDuration={6000}
        onClose={() => setShowBanned(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowBanned(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Your account has been banned. Please contact support.
        </Alert>
      </Snackbar>
      <Footer theme="dark" content={<div />} />
    </div>
  );
}