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
import { collection, query, where, getDocs } from "firebase/firestore";
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from "framer-motion";

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
    priceRange: [0, 1000],
    categories: [],
    type: "all",
    view: "all",
  });
  const [categories, setCategories] = useState([]);
  const loader = useRef(null);

  // Fetch categories and sellers
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Starting Firestore fetch...");

        const storesQuery = query(collection(db, "stores"), where("isActive", "==", true));
        const productsQuery = query(collection(db, "products"), where("isActive", "==", true));
        const [storesSnapshot, productsSnapshot] = await Promise.all([
          getDocs(storesQuery),
          getDocs(productsQuery),
        ]);

        console.log("Stores fetched:", storesSnapshot.docs.length, "documents");
        console.log("Products fetched:", productsSnapshot.docs.length, "documents");

        const storeCategories = storesSnapshot.docs.flatMap(doc => doc.data().categories || []);
        const productCategories = productsSnapshot.docs.flatMap(doc => doc.data().categories || []);
        const uniqueCategories = [...new Set([...storeCategories, ...productCategories])].sort();
        setCategories(uniqueCategories);

        const stores = storesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "store",
          price: doc.data().minPrice || 0,
          image: doc.data().thumbnailUrl || "https://picsum.photos/600/300",
        }));

        const products = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "product",
          productType: doc.data().type || "unknown",
          price: doc.data().price || 0,
          image: doc.data().imageUrls && doc.data().imageUrls[0] ? doc.data().imageUrls[0] : "https://picsum.photos/600/300",
        }));

        const combined = [...stores, ...products].sort((a, b) => {
          const priceDiff = (a.price || 0) - (b.price || 0);
          if (priceDiff !== 0) return priceDiff;
          return (a.name || "").localeCompare(b.name || "");
        });

        console.log("Combined sellers:", combined.map(s => ({ id: s.id, type: s.type })));
        setSellers(combined);
        setFilteredSellers(combined);
        setVisibleSellers(combined.slice(0, 20));
      } catch (error) {
        console.error("Firestore fetch error:", error);
      }
    };
    fetchData();
  }, []);

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

      if (filters.view !== "all") {
        const viewType = filters.view === "store" ? "store" : "product"; // Map toggle value to seller.type
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

      filtered = filtered.filter((seller) =>
        seller.price >= filters.priceRange[0] && seller.price <= filters.priceRange[1]
      );

      filtered.sort((a, b) => {
        const priceDiff = (a.price || 0) - (b.price || 0);
        if (priceDiff !== 0) return priceDiff;
        return (a.name || "").localeCompare(b.name || "");
      });

      console.log("Filtered sellers:", filtered.map(s => ({ id: s.id, type: s.type })));
      setFilteredSellers(filtered);
      setVisibleSellers(filtered.slice(0, 20));
      setPage(1);
    } catch (error) {
      console.error("Filter error:", error);
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
            categories={categories}
          />
        </div>
        <div className={classes.grid}>
          {publicKey ? (
            <GridContainer spacing={4} justifyContent="center">
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
                  <p>No stores or products found.</p>
                </GridItem>
              )}
              <div ref={loader} style={{ height: "40px" }} />
            </GridContainer>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#212121" }}>
              <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "40px" }}>
                Please Connect Your Wallet to View Marketplace
              </h1>
              <GridContainer spacing={4} justifyContent="center">
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
                    <h3 style={{ fontSize: "3rem", marginBottom: "15px" }}>
                      New to Solana or Crypto?
                    </h3>
                    <h4 style={{ fontSize: "3.75rem", marginBottom: "20px" }}>
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
                            width: "50%",
                            maxWidth: "250px",
                            height: "auto",
                            marginBottom: "20px",
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}
                        />
                      </a>
                    </motion.div>
                    <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
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
                        width: "60%",
                        maxWidth: "300px",
                        height: "auto",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    />
                  </div>
                </GridItem>
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
                          width: "70%",
                          maxWidth: "350px",
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
        </div>
      </div>
      <Footer theme="dark" content={<div />} />
    </div>
  );
}