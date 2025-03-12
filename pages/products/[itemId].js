/*eslint-disable*/
import React from "react";
import classNames from "classnames";
import ImageGallery from "react-image-gallery";
import makeStyles from '@mui/styles/makeStyles';
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import LocalShipping from "@mui/icons-material/LocalShipping";
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import Favorite from "@mui/icons-material/Favorite";
import Header from "/components/Header/Header.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import Parallax from "/components/Parallax/Parallax.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Button from "/components/CustomButtons/Button.js";
import Accordion from "/components/Accordion/Accordion.js";
import InfoArea from "/components/InfoArea/InfoArea.js";
import productStyle from "/styles/jss/nextjs-material-kit-pro/pages/productStyle.js";

const useStyles = makeStyles(productStyle);

export default function ProductPage(props) {
  const { itemId, sellerId, storeName, headerImage, item } = props;
  const [colorSelect, setColorSelect] = React.useState("0");
  const [sizeSelect, setSizeSelect] = React.useState("0");
  const [quantitySelect, setQuantitySelect] = React.useState("1");
  const classes = useStyles();

  const images = [
    { original: item.imageUrl, thumbnail: item.imageUrl },
    { original: "/img/examples/product4.jpg", thumbnail: "/img/examples/product4.jpg" },
    { original: "/img/examples/product1.jpg", thumbnail: "/img/examples/product1.jpg" },
    { original: "/img/examples/product2.jpg", thumbnail: "/img/examples/product2.jpg" },
  ];

  return (
    <div className={classes.productPage}>
      <Header
        brand="F4cets Marketplace"
        links={<HeaderLinks dropdownHoverColor="dark" />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 100,
          color: "dark"
        }}
      />
      <Parallax
        image={headerImage}
        filter="dark"
        className={classes.pageHeader}
      />
      <div className={classNames(classes.section, classes.sectionGray)}>
        <div className={classes.container}>
          <div className={classNames(classes.main, classes.mainRaised)}>
            <GridContainer>
              <GridItem md={6} sm={6}>
                <ImageGallery
                  showFullscreenButton={false}
                  showPlayButton={false}
                  startIndex={0}
                  items={images}
                  showThumbnails={true}
                  renderLeftNav={(onClick, disabled) => (
                    <button
                      className="image-gallery-left-nav"
                      disabled={disabled}
                      onClick={onClick}
                    />
                  )}
                  renderRightNav={(onClick, disabled) => (
                    <button
                      className="image-gallery-right-nav"
                      disabled={disabled}
                      onClick={onClick}
                    />
                  )}
                />
              </GridItem>
              <GridItem md={6} sm={6}>
                <h2 className={classes.title}>{item.name}</h2>
                <h4 className={classes.description}>
                  {item.inventory > 0 ? `${item.inventory} in stock` : "Out of stock"}
                </h4>
                <h3 className={classes.mainPrice}>{item.priceSol} SOL</h3>
                <Accordion
                  active={0}
                  activeColor="rose"
                  collapses={[
                    {
                      title: "Description",
                      content: <p>{item.description}</p>
                    },
                    {
                      title: "Seller Information",
                      content: (
                        <p>
                          Sold by {storeName}. {item.sellerInfo}
                        </p>
                      )
                    },
                    {
                      title: "Details and Care",
                      content: (
                        <ul>
                          {item.details.map((detail, index) => (
                            <li key={index}>{detail}</li>
                          ))}
                        </ul>
                      )
                    }
                  ]}
                />
                <GridContainer className={classes.pickSize}>
                  <GridItem md={4} sm={4}>
                    <label>Select color</label>
                    <FormControl fullWidth className={classes.selectFormControl}>
                      <Select
                        MenuProps={{ className: classes.selectMenu }}
                        classes={{ select: classes.select }}
                        value={colorSelect}
                        onChange={(event) => setColorSelect(event.target.value)}
                        inputProps={{ name: "colorSelect", id: "color-select" }}
                      >
                        <MenuItem classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }} value="0">Blue</MenuItem>
                        <MenuItem classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }} value="1">Gray</MenuItem>
                        <MenuItem classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }} value="2">White</MenuItem>
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem md={4} sm={4}>
                    <label>Select size</label>
                    <FormControl fullWidth className={classes.selectFormControl}>
                      <Select
                        MenuProps={{ className: classes.selectMenu }}
                        classes={{ select: classes.select }}
                        value={sizeSelect}
                        onChange={(event) => setSizeSelect(event.target.value)}
                        inputProps={{ name: "sizeSelect", id: "size-select" }}
                      >
                        <MenuItem classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }} value="0">Small</MenuItem>
                        <MenuItem classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }} value="1">Medium</MenuItem>
                        <MenuItem classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }} value="2">Large</MenuItem>
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem md={4} sm={4}>
                    <label>Quantity</label>
                    <FormControl fullWidth className={classes.selectFormControl}>
                      <Select
                        MenuProps={{ className: classes.selectMenu }}
                        classes={{ select: classes.select }}
                        value={quantitySelect}
                        onChange={(event) => setQuantitySelect(event.target.value)}
                        inputProps={{ name: "quantitySelect", id: "quantity-select" }}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => (
                          <MenuItem
                            key={qty}
                            classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }}
                            value={qty.toString()}
                          >
                            {qty}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <GridContainer className={classes.pullRight}>
                  <Button round color="rose">
                    Add to Cart <ShoppingCart />
                  </Button>
                </GridContainer>
              </GridItem>
            </GridContainer>
          </div>
          <div className={classNames(classes.features, classes.textCenter)}>
            <GridContainer>
              <GridItem md={4} sm={4}>
                <InfoArea
                  title="2 Days Delivery"
                  description="Fast shipping ensures your item arrives within 2 days."
                  icon={LocalShipping}
                  iconColor="info"
                  vertical
                />
              </GridItem>
              <GridItem md={4} sm={4}>
                <InfoArea
                  title="Refundable Policy"
                  description="Return within 30 days if not satisfied."
                  icon={VerifiedUser}
                  iconColor="success"
                  vertical
                />
              </GridItem>
              <GridItem md={4} sm={4}>
                <InfoArea
                  title="Popular Item"
                  description="One of our top picks this season."
                  icon={Favorite}
                  iconColor="rose"
                  vertical
                />
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { itemId } = context.params;

  // Placeholder data (to be replaced with Firestore later)
  const sampleItems = {
    "1": {
      name: "Dog Bed",
      imageUrl: "/img/examples/dogbed.jpg",
      priceSol: 10, // Placeholder, will convert from USD later
      inventory: 5, // Added inventory
      description: "Soft blue dog bed, perfect for pets.",
      sellerInfo: "Crafted with care by our artisans.",
      details: [
        "Blue stretch fabric",
        "Soft padding, durable stitching",
        "100% cotton",
        "Machine washable"
      ]
    },
    "2": {
      name: "Vase",
      imageUrl: "/img/examples/vase.jpg",
      priceSol: 15,
      inventory: 3, // Added inventory
      description: "Elegant ceramic vase, crafted by artisans.",
      sellerInfo: "Handmade with precision.",
      details: [
        "White ceramic",
        "Glossy finish",
        "Height: 12 inches",
        "Hand wash only"
      ]
    }
  };

  const item = sampleItems[itemId] || sampleItems["1"]; // Default to "1" if itemId not found
  const sellerId = "test123"; // Placeholder, tied to e-commerce page
  const storeName = "Sample Seller Store";
  const headerImage = "/img/examples/exampleshop1.jpg"; // Matches e-commerce page

  return {
    props: {
      itemId,
      sellerId,
      storeName,
      headerImage,
      item,
    },
  };
}