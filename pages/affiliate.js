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
import { collection, query, where, getDocs } from "firebase/firestore";

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
  const loader = useRef(null);

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
    fetchAffiliates();
  }, []);

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
    if (visibleAffiliates.length < filteredAffiliates.length) {
      const nextPage = page + 1;
      const newVisibleAffiliates = filteredAffiliates.slice(0, nextPage * 30);
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
      <Parallax image="/img/examples/affiliate.jpg" filter="light" small> {/* Changed filter to "light" */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            textAlign: "center",
            background: "rgba(0, 0, 0, 0.3)", /* Add a subtle overlay to enhance text contrast */
          }}
        >
          <div className={classes.brand} style={{ maxWidth: "800px" }}>
            <h1 className={classes.title}>Affiliate Partners!</h1>
            <h4>Earn 15% Crypto Cashback with Our Links – (Cookies Enabled)</h4>
          </div>
        </div>
      </Parallax>

      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classNames(classes.searchContainer, classes.searchPadding)}>
          <AffiliateSearchBar onSearch={handleSearch} searchQuery={searchQuery} />
        </div>
        <div className={classes.grid}>
          <GridContainer spacing={2} justifyContent="center">
            {visibleAffiliates.length > 0 ? (
              visibleAffiliates.map((affiliate) => (
                <GridItem key={affiliate.id} xs={12} sm={6} md={4} lg={2}>
                  <AffiliateCard affiliate={affiliate} />
                </GridItem>
              ))
            ) : (
              <GridItem>
                <p>No affiliates found.</p>
              </GridItem>
            )}
          </GridContainer>
          <div ref={loader} style={{ height: "20px" }} />
        </div>
      </div>

      <Footer theme="dark" content={<div />} />
    </div>
  );
}