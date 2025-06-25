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
import SearchBarLocal from "/components/SearchBar/SearchBarLocal.js";
import SellerCard from "/components/Card/SellerCard.js";
import styles from "/styles/jss/nextjs-material-kit-pro/pages/marketplaceStyle.js";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useWallet } from '@solana/wallet-adapter-react';
import { useUser } from "/contexts/UserContext";
import { motion } from "framer-motion";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const useStyles = makeStyles({
  ...styles,
  searchContainer: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "16px",
  },
  searchPadding: {
    padding: "16px",
  },
});

export default function Local() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  const classes = useStyles();
  const { publicKey } = useWallet();
  const { user } = useUser();
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [visibleSellers, setVisibleSellers] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    categories: [],
    type: "all",
    view: "all",
    deliveryOptions: "all",
    zipCode: "", // CHANGED: Added zipCode to initial state
  });
  const [categories, setCategories] = useState([]);
  const [showBanned, setShowBanned] = useState(false);
  const loader = useRef(null);

  // Fetch categories and sellers
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Starting Firestore fetch for local...");

        // Fetch active local stores
        const storesQuery = query(collection(db, "stores"), where("isActive", "==", true), where("local", "==", true));
        const storesSnapshot = await getDocs(storesQuery);
        console.log("Local stores fetched:", storesSnapshot.docs.length, "documents");

        // Get active local store IDs
        const activeStoreIds = storesSnapshot.docs.map(doc => doc.id);
        console.log("Active local store IDs:", activeStoreIds);

        // Fetch products from active local stores
        let products = [];
        if (activeStoreIds.length > 0) {
          // Firestore 'in' query supports up to 10 IDs; batch if needed
          const maxInQueryLength = 10;
          for (let i = 0; i < activeStoreIds.length; i += maxInQueryLength) {
            const batchIds = activeStoreIds.slice(i, i + maxInQueryLength);
            const productsQuery = query(
              collection(db, "products"),
              where("isActive", "==", true),
              where("storeId", "in", batchIds),
              where("local", "==", true)
            );
            const productsSnapshot = await getDocs(productsQuery);
            products.push(...productsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            })));
          }
        }
        console.log("Local products fetched:", products.length, "documents");

        // Process categories
        const storeCategories = storesSnapshot.docs.flatMap(doc => doc.data().categories || []);
        const productCategories = products.flatMap(doc => doc.categories || []);
        const uniqueCategories = [...new Set([...storeCategories, ...productCategories])].sort();
        setCategories(uniqueCategories);

        // Process stores
        const stores = storesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "store",
          price: doc.data().minPrice || 0,
          image: doc.data().thumbnailUrl || "https://picsum.photos/600/300",
        }));

        // Process products
        const processedProducts = products.map((doc) => ({
          id: doc.id,
          ...doc,
          type: "product",
          productType: doc.type || "unknown",
          price: doc.price || 0,
          image: doc.imageUrls && doc.imageUrls[0] ? doc.imageUrls[0] : "https://picsum.photos/600/300",
        }));

        const combined = [...stores, ...processedProducts].sort((a, b) => {
          const priceDiff = (a.price || 0) - (b.price || 0);
          if (priceDiff !== 0) return priceDiff;
          return (a.name || "").localeCompare(b.name || "");
        });

        console.log("Combined local sellers:", combined.map(s => ({ id: s.id, type: s.type })));
        setSellers(combined);
        setFilteredSellers(combined);
        setVisibleSellers(combined.slice(0, 20));
      } catch (error) {
        console.error("Firestore fetch error for local:", error);
      }
    };
    if (publicKey && user) {
      const timer = setTimeout(() => {
        if (user.isActive) {
          fetchData();
        } else {
          setShowBanned(true);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [publicKey, user]);

  const applyFilters = useCallback(() => {
    try {
      let filtered = [...sellers];
      console.log("Applying filters:", filters);

      if (searchQuery.trim()) {
        const terms = searchQuery.toLowerCase().split(/\s+/).filter((term) => term);
        filtered = filtered.filter((seller) => {
          const nameMatch = terms.some((term) =>
            (seller.name || "").toLowerCase().includes(term)
          );
          const categoryMatch = terms.some((term) =>
            (seller.categories || []).some(cat => cat.toLowerCase().includes(term))
          );
          const descriptionMatch = terms.some((term) =>
            (seller.description || "").toLowerCase().includes(term)
          );
          return nameMatch || categoryMatch || descriptionMatch;
        });
      }

      if (filters.zipCode && filters.zipCode.trim()) {
        filtered = filtered.filter((seller) => {
          const storeZip = seller.type === "store" 
            ? seller.businessInfo?.zipCode?.toString() || '' 
            : seller.zipCode?.toString() || ''; // CHANGED: Check product zipCode for products
          return storeZip.startsWith(filters.zipCode);
        });
      }

      if (filters.view !== "all") {
        const viewType = filters.view === "store" ? "store" : "product";
        filtered = filtered.filter((seller) => seller.type === viewType);
      }

      if (filters.categories.length) {
        filtered = filtered.filter((seller) =>
          (seller.categories || []).some((cat) => filters.categories.includes(cat))
        );
      }

      if (filters.type !== "all") {
        filtered = filtered.filter((seller) =>
          seller.type === "product" ? seller.productType === filters.type : true
        );
      }

      if (filters.deliveryOptions !== "all") {
        filtered = filtered.filter((seller) =>
          seller.type === "product" ? (seller.deliveryOptions || []).includes(filters.deliveryOptions) : true
        );
      }

      filtered = filtered.filter((seller) =>
        seller.price >= filters.priceRange[0] && seller.price <= filters.priceRange[1]
      );

      filtered.sort((a, b) => {
        const priceDiff = (a.price || 0) - (b.price || 0);
        if (priceDiff !== 0) return priceDiff;
        return (a.name || "").localeCompare(b.name || "");
      });

      console.log("Filtered local sellers:", filtered.map(s => ({ id: s.id, type: s.type })));
      setFilteredSellers(filtered);
      setVisibleSellers(filtered.slice(0, 20));
      setPage(1);
    } catch (error) {
      console.error("Filter error for local:", error);
    }
  }, [searchQuery, filters, sellers]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, applyFilters]);

  const loadMore = useCallback(() => {
    if (visibleSellers.length < filteredSellers.length) {
      const nextPage = page + 1;
      const newVisibleSellers = filteredSellers.slice(0, nextPage * 20);
      setVisibleSellers(newVisibleSellers);
      setPage(nextPage);
    }
  }, [page, filteredSellers, visibleSellers]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
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
  }, [loadMore]);

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
        brand="F4cets Marketplace"
        links={<HeaderLinks dropdownHoverColor="info" />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 300,
          color: "info",
        }}
      />
      <Parallax image="/img/examples/local.jpg" filter="dark" small>
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
                <h1 className={classes.title}>Local Marketplace!</h1>
                <h4>Shop Locally for RWIs, Digital Goods, & More</h4>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.grid}>
          {publicKey && user && user.isActive ? (
            <GridContainer spacing={4} justifyContent="center">
              <GridItem xs={12}>
                <div className={classNames(classes.searchContainer, classes.searchPadding)}>
                  <SearchBarLocal
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                    searchQuery={searchQuery}
                    filters={filters}
                    categories={categories}
                  />
                </div>
              </GridItem>
              {visibleSellers.length > 0 ? (
                visibleSellers.map((seller) => (
                  <GridItem
                    key={seller.id}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2}
                    style={{ marginBottom: "24px" }}
                  >
                    <SellerCard seller={seller} />
                  </GridItem>
                ))
              ) : (
                <GridItem>
                  <p>No local stores or products found.</p>
                </GridItem>
              )}
              <div ref={loader} style={{ height: "40px" }} />
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
                  img#solflare-hand-image {
                    max-width: 100% !important;
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
                Please Connect Your Wallet to View Local Marketplace
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
                      variants={logoVariants}
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
                        maxWidth: "60%",
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
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
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