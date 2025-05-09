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
import SearchBar from "/components/SearchBar/SearchBar.js";
import SellerCard from "/components/Card/SellerCard.js";
import styles from "/styles/jss/nextjs-material-kit-pro/pages/marketplaceStyle.js";
import { db } from "../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from "framer-motion";

const useStyles = makeStyles(styles);

export default function Marketplace() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  const classes = useStyles();
  const { publicKey } = useWallet();
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [visibleSellers, setVisibleSellers] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    priceMin: undefined,
    priceMax: undefined,
    categories: [],
    designers: [],
  });
  const loader = useRef(null);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        console.log("Starting Firestore fetch...");

        // Fetch stores
        const storesQuery = query(
          collection(db, "stores"),
          where("isActive", "==", true)
        );
        console.log("Executing stores query...");
        const storesSnapshot = await getDocs(storesQuery);
        console.log("Stores fetched:", storesSnapshot.docs.length, "documents");

        // Fetch products
        const productsQuery = query(
          collection(db, "products"),
          where("isActive", "==", true),
          where("quantity", ">", 0)
        );
        console.log("Executing products query...");
        const productsSnapshot = await getDocs(productsQuery);
        console.log("Products fetched:", productsSnapshot.docs.length, "documents");

        const stores = storesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "store",
          price: doc.data().minPrice || 0,
        }));
        const products = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "product",
          price: doc.data().price || 0,
        }));

        // Combine and sort
        const combined = [...stores, ...products].sort((a, b) => {
          const priceDiff = (a.price || 0) - (b.price || 0);
          if (priceDiff !== 0) return priceDiff;
          return (a.name || "").localeCompare(b.name || "");
        });

        setSellers(combined);
        setFilteredSellers(combined);
        setVisibleSellers(combined.slice(0, 20));
      } catch (error) {
        console.error("Detailed Firestore error:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
      }
    };
    fetchSellers();
  }, []);

  const applyFilters = useCallback(async () => {
    try {
      // Base queries
      let storesQuery = query(
        collection(db, "stores"),
        where("isActive", "==", true)
      );
      let productsQuery = query(
        collection(db, "products"),
        where("isActive", "==", true),
        where("quantity", ">", 0)
      );

      // Apply filters to stores
      if (filters.categories.length) {
        storesQuery = query(
          storesQuery,
          where("categories", "array-contains-any", filters.categories)
        );
      }
      if (filters.priceMin !== undefined) {
        storesQuery = query(storesQuery, where("minPrice", ">=", filters.priceMin));
      }
      if (filters.priceMax !== undefined) {
        storesQuery = query(storesQuery, where("maxPrice", "<=", filters.priceMax));
      }

      // Apply filters to products
      if (filters.categories.length) {
        productsQuery = query(productsQuery, where("category", "in", filters.categories));
      }
      if (filters.priceMin !== undefined) {
        productsQuery = query(productsQuery, where("price", ">=", filters.priceMin));
      }
      if (filters.priceMax !== undefined) {
        productsQuery = query(productsQuery, where("price", "<=", filters.priceMax));
      }

      // Fetch data
      console.log("Fetching filtered stores...");
      const storesSnapshot = await getDocs(storesQuery);
      console.log("Filtered stores fetched:", storesSnapshot.docs.length, "documents");

      console.log("Fetching filtered products...");
      const productsSnapshot = await getDocs(productsQuery);
      console.log("Filtered products fetched:", productsSnapshot.docs.length, "documents");

      const stores = storesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "store",
        price: doc.data().minPrice || 0,
      }));
      const products = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "product",
        price: doc.data().price || 0,
      }));

      // Combine and apply search
      let filtered = [...stores, ...products];
      if (searchQuery.trim()) {
        const terms = searchQuery.toLowerCase().split(/\s+/).filter((term) => term);
        filtered = filtered.filter((seller) => {
          const nameMatch = terms.some((term) =>
            (seller.name || "").toLowerCase().includes(term)
          );
          const categoryMatch = terms.some((term) =>
            (seller.category || "").toLowerCase().includes(term)
          );
          const descriptionMatch = terms.some((term) =>
            (seller.description || "").toLowerCase().includes(term)
          );
          const tagsMatch =
            seller.tags &&
            terms.some((term) =>
              seller.tags.some((tag) => (tag.value || "").toLowerCase().includes(term))
            );
          return nameMatch || categoryMatch || descriptionMatch || tagsMatch;
        });
      }

      // Sort
      filtered.sort((a, b) => {
        const priceDiff = (a.price || 0) - (b.price || 0);
        if (priceDiff !== 0) return priceDiff;
        return (a.name || "").localeCompare(b.name || "");
      });

      setFilteredSellers(filtered);
      setVisibleSellers(filtered.slice(0, 20));
      setPage(1);
    } catch (error) {
      console.error("Error applying filters:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
    }
  }, [searchQuery, filters]);

  const handleSearch = (query, currentFilters) => {
    setSearchQuery(query);
    setFilters(currentFilters || filters);
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
        brand="F4cets Marketplace"
        links={<HeaderLinks dropdownHoverColor="info" />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 300,
          color: "info",
        }}
      />
      <Parallax image="/img/examples/clark-street-merc.jpg" filter="dark" small>
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
                <h1 className={classes.title}>Marketplace!</h1>
                <h4>Buy, Mint, Sell RWA & RWI NFTs</h4>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classNames(classes.searchContainer, classes.searchPadding)}>
          <SearchBar
            onSearch={handleSearch}
            onFilter={handleFilter}
            searchQuery={searchQuery}
            filters={filters}
            categories={["Art & Crafts", "Jewelry", "Handmade Goods", "Furniture", "Electronics"]}
          />
        </div>
        <div className={classes.grid}>
          {publicKey ? (
            <GridContainer spacing={3} justifyContent="center">
              {visibleSellers.map((seller) => (
                <GridItem key={seller.id} xs={12} sm={6} md={2}>
                  <SellerCard seller={seller} />
                </GridItem>
              ))}
            </GridContainer>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#212121" }}>
              <h1
                style={{
                  fontSize: { xs: "1.5rem", md: "2.5rem" }, // Reduced for mobile
                  fontWeight: "bold",
                  marginBottom: "40px",
                  lineHeight: "1.2",
                }}
              >
                Please Connect Your Wallet to View Marketplace
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
                      style={{
                        fontSize: { xs: "1.5rem", md: "3rem" }, // Reduced for mobile
                        marginBottom: "15px",
                      }}
                    >
                      New to Solana or Crypto?
                    </h3>
                    <h4
                      style={{
                        fontSize: { xs: "1.5rem", md: "3.75rem" }, // Reduced for mobile
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
                          transition: { duration: 0.5 },
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
                      style={{
                        fontSize: { xs: "1.25rem", md: "2.5rem" }, // Reduced for mobile
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
          {publicKey && <div ref={loader} style={{ height: "20px" }} />}
        </div>
      </div>

      <Footer theme="dark" content={<div />} />
    </div>
  );
}