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

const useStyles = makeStyles(styles);

export default function Marketplace() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  const classes = useStyles();
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [visibleSellers, setVisibleSellers] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    priceMin: undefined, // Changed from 0 to undefined
    priceMax: undefined, // Changed from 900 to undefined
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
      if (filters.priceMin !== undefined) { // Check for undefined instead of falsy
        storesQuery = query(storesQuery, where("minPrice", ">=", filters.priceMin));
      }
      if (filters.priceMax !== undefined) { // Check for undefined instead of falsy
        storesQuery = query(storesQuery, where("maxPrice", "<=", filters.priceMax));
      }

      // Apply filters to products
      if (filters.categories.length) {
        productsQuery = query(productsQuery, where("category", "in", filters.categories));
      }
      if (filters.priceMin !== undefined) { // Check for undefined instead of falsy
        productsQuery = query(productsQuery, where("price", ">=", filters.priceMin));
      }
      if (filters.priceMax !== undefined) { // Check for undefined instead of falsy
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
                <h4>Buy, Mint, Sell RWA NFTs</h4>
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
          <GridContainer spacing={3} justifyContent="center">
            {visibleSellers.map((seller) => (
              <GridItem key={seller.id} xs={12} sm={6} md={2}>
                <SellerCard seller={seller} />
              </GridItem>
            ))}
          </GridContainer>
          <div ref={loader} style={{ height: "20px" }} />
        </div>
      </div>

      <Footer theme="dark" content={<div />} />
    </div>
  );
}