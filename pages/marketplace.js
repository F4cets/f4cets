import React, { useState, useEffect, useCallback } from "react";
import classNames from "classnames";
import makeStyles from '@mui/styles/makeStyles';
import Header from "/components/Header/Header.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import Parallax from "/components/Parallax/Parallax.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import SearchBar from "/components/SearchBar/SearchBar.js";
import SellerCard from "/components/Card/SellerCard.js";
import styles from "/styles/jss/nextjs-material-kit-pro/pages/marketplaceStyle.js";
import InfiniteScroll from 'react-infinite-scroll-component'; // Install with: npm install react-infinite-scroll-component

const useStyles = makeStyles(styles);

export default function Marketplace() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  const classes = useStyles();
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentItems, setCurrentItems] = useState(20); // Initial load of 20 sellers

  const fetchMoreData = useCallback(() => {
    if (currentItems >= 10000) { // Total number of fake sellers
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      setCurrentItems(prev => prev + 20); // Load 20 more sellers
    }, 500);
  }, [currentItems]);

  useEffect(() => {
    console.log("Setting fake sellers...");
    const fakeSellers = Array.from({ length: 10000 }, (_, i) => ({
      id: i + 1,
      name: `Seller ${i + 1}`,
      image: `/img/seller${(i % 3) + 1}.jpg`, // Cycle through seller1.jpg, seller2.jpg, seller3.jpg
      description: `Description for Seller ${i + 1}`,
      price: Math.floor(Math.random() * 300) + 100, // Random price between 100 and 400
      category: ["art", "jewelry", "crafts"][i % 3],
      designer: `designer${i % 3}`,
    }));
    setSellers(fakeSellers);
    setFilteredSellers(fakeSellers.slice(0, currentItems));
    console.log("Sellers set:", fakeSellers.slice(0, currentItems));
  }, []);

  const handleSearch = (query) => {
    console.log("Searching for:", query);
    const filtered = sellers.filter(seller =>
      seller.name.toLowerCase().includes(query.toLowerCase()) ||
      seller.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSellers(filtered.slice(0, currentItems));
    setHasMore(currentItems < filtered.length);
  };

  const handleFilter = (filters) => {
    console.log("Filtering with:", filters);
    let filtered = [...sellers];
    if (filters.priceMin) filtered = filtered.filter(seller => seller.price >= filters.priceMin);
    if (filters.priceMax) filtered = filtered.filter(seller => seller.price <= filters.priceMax);
    if (filters.categories.length) filtered = filtered.filter(seller => filters.categories.includes(seller.category));
    if (filters.designers.length) filtered = filtered.filter(seller => filters.designers.includes(seller.designer));
    setFilteredSellers(filtered.slice(0, currentItems));
    setHasMore(currentItems < filtered.length);
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
        <div className={classes.grid} id="scrollableDiv">
          <InfiniteScroll
            dataLength={filteredSellers.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p>No more sellers to load.</p>}
            scrollableTarget="scrollableDiv"
          >
            <GridContainer spacing={2}> {/* Reduced spacing for tighter layout */}
              {filteredSellers.length > 0 ? (
                filteredSellers.map((seller) => (
                  <GridItem key={seller.id} xs={12} sm={6} md={3}> {/* 4 cards per row */}
                    <SellerCard seller={seller} />
                  </GridItem>
                ))
              ) : (
                <GridItem>
                  <p>No sellers found.</p>
                </GridItem>
              )}
            </GridContainer>
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}