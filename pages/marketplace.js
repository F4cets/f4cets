/*eslint-disable*/
import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    console.log("Setting fake sellers...");
    const fakeSellers = [
      { id: 1, name: "Seller1", image: "seller1.jpg", description: "Art & Crafts" },
      { id: 2, name: "Seller2", image: "seller2.jpg", description: "Jewelry" },
      { id: 3, name: "Seller3", image: "seller3.jpg", description: "Handmade Goods" },
      { id: 4, name: "Seller4", image: "seller4.jpg", description: "Furniture" },
      { id: 5, name: "Seller5", image: "seller5.jpg", description: "Electronics" },
    ];
    setSellers(fakeSellers);
    setFilteredSellers(fakeSellers);
    console.log("Sellers set:", fakeSellers);
  }, []);

  const handleSearch = (query) => {
    const filtered = sellers.filter(seller =>
      seller.name.toLowerCase().includes(query.toLowerCase()) ||
      seller.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSellers(filtered);
  };

  const handleFilter = (filters) => {
    let filtered = [...sellers];
    if (filters.priceMin) filtered = filtered.filter(seller => seller.price >= filters.priceMin);
    if (filters.priceMax) filtered = filtered.filter(seller => seller.price <= filters.priceMax);
    if (filters.categories.length) filtered = filtered.filter(seller => filters.categories.includes(seller.category));
    if (filters.designers.length) filtered = filtered.filter(seller => filters.designers.includes(seller.designer));
    setFilteredSellers(filtered);
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
        <div className={classNames(classes.searchContainer, classes.searchPadding)}> {/* Added padding class */}
          <SearchBar onSearch={handleSearch} onFilter={handleFilter} />
        </div>
        <div className={classes.grid}>
          <GridContainer spacing={3} justifyContent="center"> {/* Added justifyContent="center" */}
            {filteredSellers.map((seller) => (
              <GridItem key={seller.id} xs={12} sm={6} md={2}>
                <SellerCard seller={seller} />
              </GridItem>
            ))}
          </GridContainer>
        </div>
      </div>

      <Footer
        theme="dark"
        content={<div />} // Added to satisfy propTypes
      />
    </div>
  );
}