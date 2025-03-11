import React, { useState, useEffect } from "react";
import classNames from "classnames";
import Slider from "nouislider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
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
  const { sellerId, listings = [] } = props;
  const [checked, setChecked] = useState([1]);
  const [priceRange, setPriceRange] = useState([0, 20]);
  const [visibleListings, setVisibleListings] = useState(listings.slice(0, 3));
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    if (
      !document
        .getElementById("sliderRegular")
        .classList.contains("noUi-target")
    ) {
      Slider.create(document.getElementById("sliderRegular"), {
        start: priceRange,
        connect: true,
        range: { min: 0, max: 50 },
        step: 0.01,
      }).on("update", function (values) {
        setPriceRange([parseFloat(values[0]).toFixed(2), parseFloat(values[1]).toFixed(2)]);
      });
    }
    return function cleanup() {};
  }, []);

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

  const filteredListings = visibleListings.filter(
    (item) => item.priceSol >= priceRange[0] && item.priceSol <= priceRange[1]
  );

  return (
    <div className="section">
      <div className="container">
        <h2>Find What You Need</h2>
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
                  active={[0]}
                  activeColor="rose"
                  collapses={[
                    {
                      title: "Price Range (SOL)",
                      content: (
                        <CardBody className="cardBodyRefine">
                          <span className={classNames("pullLeft", "priceSlider")}>
                            {priceRange[0]} SOL
                          </span>
                          <span className={classNames("pullRight", "priceSlider")}>
                            {priceRange[1]} SOL
                          </span>
                          <br />
                          <br />
                          <div id="sliderRegular" className="slider-rose" />
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
                            <FormControlLabel
                              control={
                                <Checkbox
                                  disableRipple
                                  tabIndex={-1}
                                  onClick={() => handleToggle(1)}
                                  checked={checked.indexOf(1) !== -1}
                                  checkedIcon={<Check className="checkedIcon" />}
                                  icon={<Check className="uncheckedIcon" />}
                                  classes={{
                                    checked: "checked",
                                    root: "checkRoot",
                                  }}
                                />
                              }
                              classes={{ label: "label" }}
                              label="Pet Supplies"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  disableRipple
                                  tabIndex={-1}
                                  onClick={() => handleToggle(2)}
                                  checked={checked.indexOf(2) !== -1}
                                  checkedIcon={<Check className="checkedIcon" />}
                                  icon={<Check className="uncheckedIcon" />}
                                  classes={{
                                    checked: "checked",
                                    root: "checkRoot",
                                  }}
                                />
                              }
                              classes={{ label: "label" }}
                              label="Home Decor"
                            />
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem md={9} sm={9}>
            <GridContainer>
              {filteredListings.map((item) => (
                <GridItem md={4} sm={4} key={item.id}>
                  <EcommerceCard item={item} />
                </GridItem>
              ))}
            </GridContainer>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}