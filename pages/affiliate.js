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
import AffiliateSearchBar from "/components/AffiliateSearchBar/AffiliateSearchBar.js"; // Updated import
import AffiliateCard from "/components/Card/AffiliateCard.js";
import styles from "/styles/jss/nextjs-material-kit-pro/pages/affiliateStyle.js";
import { db } from "../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

const useStyles = makeStyles(styles);

export default function Affiliate() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  const classes = useStyles();
  const [affiliates, setAffiliates] = useState([]);
  const [filteredAffiliates, setFilteredAffiliates] = useState([]);
  const [visibleAffiliates, setVisibleAffiliates] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 900,
    categories: [],
    designers: [],
  });
  const loader = useRef(null);

  useEffect(() => {
    const fetchAffiliates = async () => {
      try {
        console.log("Starting Firestore fetch for affiliates...");

        // Fetch affiliates (placeholder query, replace with actual affiliates collection)
        const affiliatesQuery = query(
          collection(db, "affiliates"),
          where("isActive", "==", true)
        );
        console.log("Executing affiliates query...");
        const affiliatesSnapshot = await getDocs(affiliatesQuery);
        console.log("Affiliates fetched:", affiliatesSnapshot.docs.length, "documents");

        const affiliatesData = affiliatesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "affiliate",
          price: doc.data().commissionRate || 0,
        }));

        const combined = [...affiliatesData].sort((a, b) => {
          const priceDiff = (a.price || 0) - (b.price || 0);
          if (priceDiff !== 0) return priceDiff;
          return (a.name || "").localeCompare(b.name || "");
        });

        setAffiliates(combined);
        setFilteredAffiliates(combined);
        setVisibleAffiliates(combined.slice(0, 20));
      } catch (error) {
        console.error("Detailed Firestore error for affiliates:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
      }
    };
    fetchAffiliates();
  }, []);

  const applyFilters = useCallback(async () => {
    try {
      let affiliatesQuery = query(
        collection(db, "affiliates"),
        where("isActive", "==", true)
      );

      if (filters.categories.length) {
        affiliatesQuery = query(
          affiliatesQuery,
          where("categories", "array-contains-any", filters.categories)
        );
      }
      if (filters.priceMin) {
        affiliatesQuery = query(affiliatesQuery, where("commissionRate", ">=", filters.priceMin));
      }
      if (filters.priceMax) {
        affiliatesQuery = query(affiliatesQuery, where("commissionRate", "<=", filters.priceMax));
      }

      console.log("Fetching filtered affiliates...");
      const affiliatesSnapshot = await getDocs(affiliatesQuery);
      console.log("Filtered affiliates fetched:", affiliatesSnapshot.docs.length, "documents");

      const affiliatesData = affiliatesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "affiliate",
        price: doc.data().commissionRate || 0,
      }));

      let filtered = [...affiliatesData];
      if (searchQuery.trim()) {
        const terms = searchQuery.toLowerCase().split(/\s+/).filter((term) => term);
        filtered = filtered.filter((affiliate) => {
          const nameMatch = terms.some((term) =>
            (affiliate.name || "").toLowerCase().includes(term)
          );
          const categoryMatch = terms.some((term) =>
            (affiliate.category || "").toLowerCase().includes(term)
          );
          const descriptionMatch = terms.some((term) =>
            (affiliate.description || "").toLowerCase().includes(term)
          );
          return nameMatch || categoryMatch || descriptionMatch;
        });
      }

      filtered.sort((a, b) => {
        const priceDiff = (a.price || 0) - (b.price || 0);
        if (priceDiff !== 0) return priceDiff;
        return (a.name || "").localeCompare(b.name || "");
      });

      setFilteredAffiliates(filtered);
      setVisibleAffiliates(filtered.slice(0, 20));
      setPage(1);
    } catch (error) {
      console.error("Error applying filters for affiliates:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
    }
  }, [searchQuery, filters]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Removed filters handling since AffiliateSearchBar doesn't use filters
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, applyFilters]);

  const loadMore = useCallback(() => {
    if (visibleAffiliates.length < filteredAffiliates.length) {
      const nextPage = page + 1;
      const newVisibleAffiliates = filteredAffiliates.slice(0, nextPage * 20);
      setVisibleAffiliates(newVisibleAffiliates);
      setPage(nextPage);
    }
  }, [page, filteredAffiliates, visibleAffiliates]);

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
        brand="F4cets Affiliate"
        links={<HeaderLinks dropdownHoverColor="info" />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 300,
          color: "info",
        }}
      />
      <Parallax image="/img/examples/affiliate.jpg" filter="dark" small>
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
                <h1 className={classes.title}>Affiliate Partners!</h1>
                <h4>Earn Upto 45% Crypto Cashback with Our Links – (Cookies Enabled)</h4>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classNames(classes.searchContainer, classes.searchPadding)}>
          <AffiliateSearchBar
            onSearch={handleSearch}
            searchQuery={searchQuery}
          />
        </div>
        <div className={classes.grid}>
          <GridContainer spacing={3} justifyContent="center">
            {visibleAffiliates.map((affiliate) => (
              <GridItem key={affiliate.id} xs={12} sm={6} md={2}>
                <AffiliateCard affiliate={affiliate} />
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