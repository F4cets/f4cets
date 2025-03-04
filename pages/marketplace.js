/*eslint-disable*/
import React, { useState, useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import makeStyles from '@mui/styles/makeStyles';
// core components
import Header from "/components/Header/Header.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import Parallax from "/components/Parallax/Parallax.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";

// Import SearchBar and SellerCard
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

  // Use fake seller data instead of Firestore
  useEffect(() => {
    console.log("Setting fake sellers...");
    const fakeSellers = [
      { 
        id: 1, 
        name: "Artisan Alice", 
        image: "/img/examples/seller1.jpg", // Existing image
        description: "Unique handcrafted art pieces", 
        price: 150, 
        category: "art", 
        designer: "alice" 
      },
      { 
        id: 2, 
        name: "Jeweler Jack", 
        image: "/img/examples/seller2.jpg", // Existing image
        description: "Custom jewelry designs", 
        price: 200, 
        category: "jewelry", 
        designer: "jack" 
      },
      { 
        id: 3, 
        name: "Crafter Claire", 
        image: "/img/examples/seller3.jpg", // Existing image
        description: "Eco-friendly crafts", 
        price: 120, 
        category: "crafts", 
        designer: "claire" 
      },
    ];
    setSellers(fakeSellers);
    setFilteredSellers(fakeSellers);
    console.log("Sellers set:", fakeSellers);
  }, []);

  const handleSearch = (query) => {
    console.log("Searching for:", query);
    const filtered = sellers.filter(seller =>
      seller.name.toLowerCase().includes(query.toLowerCase()) ||
      seller.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSellers(filtered);
    console.log("Filtered sellers:", filtered);
  };

  const handleFilter = (filters) => {
    console.log("Filtering with:", filters);
    let filtered = [...sellers];
    if (filters.priceMin) filtered = filtered.filter(seller => seller.price >= filters.priceMin);
    if (filters.priceMax) filtered = filtered.filter(seller => seller.price <= filters.priceMax);
    if (filters.categories.length) filtered = filtered.filter(seller => filters.categories.includes(seller.category));
    if (filters.designers.length) filtered = filtered.filter(seller => filters.designers.includes(seller.designer));
    setFilteredSellers(filtered);
    console.log("Filtered sellers after filter:", filtered);
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
        <div className={classes.searchContainer}>
          <SearchBar onSearch={handleSearch} onFilter={handleFilter} />
        </div>
        <div className={classes.grid}>
          <GridContainer spacing={3}>
            {filteredSellers.length > 0 ? (
              filteredSellers.map((seller) => (
                <GridItem key={seller.id} xs={12} sm={6} md={4}>
                  <SellerCard seller={seller} />
                </GridItem>
              ))
            ) : (
              <GridItem>
                <p>No sellers found.</p>
              </GridItem>
            )}
          </GridContainer>
        </div>
      </div>
    </div>
  );
}