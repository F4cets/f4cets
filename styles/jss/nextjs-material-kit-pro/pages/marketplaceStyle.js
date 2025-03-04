import {
  title,
  main,
  mainRaised,
  mrAuto,
  mlAuto,
  container,
  description,
  blackColor,
  whiteColor,
  grayColor,
  hexToRgb,
} from "/styles/jss/nextjs-material-kit-pro.js";
import imagesStyles from "/styles/jss/nextjs-material-kit-pro/imagesStyles.js";

const marketplaceStyle = {
  ...imagesStyles,
  title,
  main,
  mainRaised,
  mrAuto,
  mlAuto,
  description,
  textCenter: {
    textAlign: "center !important",
  },
  container: {
    ...container,
    zIndex: "2",
  },
  brand: {
    "& h1, & h4": {
      color: whiteColor,
    },
  },
  card: {
    margin: "0 auto",
    width: "100%",
    maxWidth: "300px",
    transition: "all 0.3s ease", // Base transition for Framer Motion
    backgroundColor: whiteColor,
    color: blackColor,
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.03)", // Minimal default shadow
    position: "relative", // Ensure positioning for z-index
    zIndex: 1, // Prevent overlap with other elements
  },
  cardAnimated: {
    transformOrigin: "center", // Ensure rotation pivots from center
    perspective: "1000px", // Add 3D perspective for rotation
    overflow: "hidden", // Ensure shadow stays within bounds
    position: "relative", // Ensure positioning for z-index
    zIndex: 1, // Prevent overlap with adjacent cards
    backgroundColor: whiteColor, // Explicitly set background to prevent transparency
  },
  cardHeaderImageNoMargin: {
    marginTop: "0 !important", // Remove negative margin to prevent cutoff
  },
  cardHeaderImageContainer: {
    padding: "8px", // Ensure 8px padding around the image
    "& img": {
      width: "100%",
      height: "auto", // Maintain aspect ratio
      borderRadius: "6px", // Match card radius
      objectFit: "cover", // Ensure image covers the area without stretching
    },
  },
  subscribeLine: {
    padding: "1.875rem 0px",
    "& $card": {
      marginTop: "30px",
    },
    "& form": { margin: "0px" },
    "&$subscribeLineImage:after": {
      position: "absolute",
      zIndex: 1,
      width: "100%",
      height: "100%",
      display: "block",
      left: 0,
      top: 0,
      content: "''",
      backgroundColor: "rgba(" + hexToRgb(blackColor) + ",0.66)",
    },
  },
  subscribeLineImage: {
    position: "relative",
    backgroundPosition: "top center",
    backgroundSize: "cover",
    "& $container": {
      zIndex: 2,
      position: "relative",
    },
    "& $title": {
      color: whiteColor,
    },
    "& $description": {
      color: grayColor[0],
    },
  },
  searchContainer: {
    marginTop: "40px", // Increased spacing above search bar
    marginBottom: "40px", // Increased spacing below search bar
    padding: "0 16px",
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    alignItems: "center",
  },
  search: {
    flexGrow: 1,
    maxWidth: "500px",
    backgroundColor: whiteColor,
    borderRadius: "4px",
    "& .MuiInputBase-root": {
      backgroundColor: whiteColor,
    },
  },
  filter: {
    minWidth: "150px",
    backgroundColor: whiteColor,
    borderRadius: "4px",
    "& .MuiSelect-select": {
      backgroundColor: whiteColor,
    },
  },
  grid: {
    padding: "0 16px",
    marginTop: "20px",
    marginBottom: "40px", // Padding below cards
    position: "relative", // Ensure positioning for z-index
    zIndex: 0, // Lower z-index to prevent interference with cards
  },
  button: {
    marginTop: "15px", // Ensure button is spaced below description
  },
};

export default marketplaceStyle;