/*eslint-disable*/
import React, { useState, useEffect, useRef, useCallback } from "react";
import classNames from "classnames";
import makeStyles from '@mui/styles/makeStyles';
import Header from "/components/Header/Header.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import Footer from "/components/Footer/Footer.js";
import Parallax from "/components/Parallax/Parallax.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import SearchBar from "/components/SearchBar/SearchBar.js";
import SellerCard from "/components/Card/SellerCard.js";
import styles from "/styles/jss/nextjs-material-kit-pro/pages/marketplaceStyle.js";

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
  const loader = useRef(null);

  // Generate 100 fake sellers with categories and prices
  useEffect(() => {
    console.log("Setting fake sellers...");
    const categories = ["Art & Crafts", "Jewelry", "Handmade Goods", "Furniture", "Electronics"];
    const fakeSellers = Array.from({ length: 100 }, (_, index) => ({
      id: index + 1,
      name: `Seller${index + 1}`,
      image: `seller${((index % 5) + 1)}.jpg`, // Reuse 5 images (1-5)
      description: `${categories[index % 5]} - Item ${index + 1}`,
      category: categories[index % 5],
      price: Math.floor(Math.random() * 900) + 1, // Random price between 1 and 900 SOL
    }));
    setSellers(fakeSellers);
    setFilteredSellers(fakeSellers);
    setVisibleSellers(fakeSellers.slice(0, 20)); // Load first 20
    console.log("Sellers set:", fakeSellers);
  }, []);

  const handleSearch = (query) => {
    const filtered = sellers.filter(seller =>
      seller.name.toLowerCase().includes(query.toLowerCase()) ||
      seller.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSellers(filtered);
    setVisibleSellers(filtered.slice(0, 20)); // Reset to first 20 on search
    setPage(1);
  };

  const handleFilter = (filters) => {
    let filtered = [...sellers];
    if (filters.priceMin) filtered = filtered.filter(seller => seller.price >= filters.priceMin);
    if (filters.priceMax) filtered = filtered.filter(seller => seller.price <= filters.priceMax);
    if (filters.categories.length) filtered = filtered.filter(seller => filters.categories.includes(seller.category));
    if (filters.designers.length) filtered = filtered.filter(seller => filters.designers.includes(seller.designer));
    setFilteredSellers(filtered);
    setVisibleSellers(filtered.slice(0, 20)); // Reset to first 20 on filter
    setPage(1);
  };

  const loadMore = useCallback(() => {
    if (visibleSellers.length < filteredSellers.length) {
      const nextPage = page + 1;
      const newVisibleSellers = filteredSellers.slice(0, nextPage * 20);
      setVisibleSellers(newVisibleSellers);
      setPage(nextPage);
    }
  }, [page, filteredSellers, visibleSellers]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    }, { threshold: 0.1 });

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
          color: "info"
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
                <h4>
                  Buy, Mint, Sell RWA NFTs with the touch of a button
                </h4>
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
            categories={["Art & Crafts", "Jewelry", "Handmade Goods", "Furniture", "Electronics"]} // Pass categories
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
          <div ref={loader} style={{ height: "20px" }} /> {/* Loader for infinite scroll */}
        </div>
      </div>

      <Footer
        theme="dark"
        content={<div />} // Added to satisfy propTypes
      />
    </div>
  );
}