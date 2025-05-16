import React, { useState, useEffect } from "react";
import Head from "next/head";
import classNames from "classnames";
import Slider from "nouislider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Cached from "@mui/icons-material/Cached";
import Check from "@mui/icons-material/Check";
import Accordion from "/components/Accordion/Accordion.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Card from "/components/Card/Card.js";
import CardBody from "/components/Card/CardBody.js";
import Button from "/components/CustomButtons/Button.js";
import Clearfix from "/components/Clearfix/Clearfix.js";
import EcommerceCard from "/components/Card/EcommerceCard.js";

export default function DynamicProducts(props) {
  const { storeId, listings = [], solPrice, flash } = props;
  const [checked, setChecked] = useState([]);
  const maxPrice = listings.length > 0 ? Math.max(...listings.map(item => item.priceUsdc)) : 100;
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [productType, setProductType] = useState("all");
  const [visibleListings, setVisibleListings] = useState(listings.slice(0, 3));
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;

  const categories = [...new Set(listings.flatMap(item => item.category || []))].sort();

  useEffect(() => {
    const slider = document.getElementById("sliderRegular");
    if (slider && !slider.classList.contains("noUi-target")) {
      Slider.create(slider, {
        start: priceRange,
        connect: true,
        range: { min: 0, max: maxPrice },
        step: 1,
      }).on("update", function (values) {
        setPriceRange([parseInt(values[0], 10), parseInt(values[1], 10)]);
      });
    }
    return function cleanup() {
      if (slider && slider.noUiSlider) {
        slider.noUiSlider.destroy();
      }
    };
  }, [maxPrice]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        const nextPage = page + 1;
        const newListings = listings.slice(0, nextPage * itemsPerPage);
        setVisibleListings(newListings);
        setPage(nextPage);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, listings]);

  const handleToggle = (value) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const filteredListings = visibleListings.filter((item) => {
    const priceInRange = item.priceUsdc >= priceRange[0] && item.priceUsdc <= priceRange[1];
    const categoryMatch = checked.length === 0 || checked.includes(item.category);
    const typeMatch = productType === "all" || item.type === productType;
    return priceInRange && categoryMatch && typeMatch;
  });

  return (
    <div className="section" style={{ paddingTop: '40px' }}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="container">
        <GridContainer>
          <GridItem md={3} sm={3}>
            <Card plain>
              <CardBody className="cardBodyRefine">
                <h4 className="cardTitle textLeft">
                  Refine
                  <Button link justIcon size="sm" className="pullRight refineButton">
                    <Cached />
                  </Button>
                  <Clearfix />
                </h4>
                <Accordion
                  active={[0, 1, 2]}
                  activeColor="rose"
                  collapses={[
                    {
                      title: "Price Range (USDC)",
                      content: (
                        <CardBody className="cardBodyRefine">
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className={classNames("priceSlider")}>
                              ${priceRange[0].toLocaleString()}
                            </span>
                            <span className={classNames("priceSlider")}>
                              ${priceRange[1].toLocaleString()}
                            </span>
                          </div>
                          <div id="sliderRegular" className="slider-rose" style={{ marginTop: '10px' }} />
                        </CardBody>
                      ),
                    },
                    {
                      title: "Category",
                      content: (
                        <div className="customExpandPanel">
                          <div
                            className={
                              "checkboxAndRadio " + "checkboxAndRadioHorizontal"
                            }
                          >
                            {categories.map((category, index) => (
                              <FormControlLabel
                                key={index}
                                control={
                                  <Checkbox
                                    disableRipple
                                    tabIndex={-1}
                                    onClick={() => handleToggle(category)}
                                    checked={checked.includes(category)}
                                    checkedIcon={<Check className="checkedIcon" />}
                                    icon={<Check className="uncheckedIcon" />}
                                    classes={{
                                      checked: "checked",
                                      root: "checkRoot",
                                    }}
                                  />
                                }
                                classes={{ label: "label" }}
                                label={category}
                              />
                            ))}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Product Type",
                      content: (
                        <CardBody className="cardBodyRefine">
                          <FormControl fullWidth>
                            <Select
                              value={productType}
                              onChange={(e) => setProductType(e.target.value)}
                              classes={{ select: "select" }}
                            >
                              <MenuItem value="all">All</MenuItem>
                              <MenuItem value="digital">Digital</MenuItem>
                              <MenuItem value="rwi">Real World Item (RWI)</MenuItem>
                            </Select>
                          </FormControl>
                        </CardBody>
                      ),
                    },
                  ]}
                />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem md={9} sm={9}>
            <GridContainer>
              {filteredListings.length > 0 ? (
                filteredListings.map((item) => (
                  <GridItem md={4} sm={4} key={item.id}>
                    <EcommerceCard item={{ ...item, solPrice, flash }} />
                  </GridItem>
                ))
              ) : (
                <GridItem>
                  <p>No products match the current filters.</p>
                </GridItem>
              )}
            </GridContainer>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}