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
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05) rotate(10deg)",
      boxShadow: `0 12px 20px -10px rgba(${hexToRgb(blackColor)}, 0.28)`,
    },
    backgroundColor: whiteColor,
    color: blackColor,
    borderRadius: "8px",
    overflow: "visible !important", // Ensure content isn’t hidden
    display: "block !important", // Override any flex issues
    height: "auto", // Ensure height adjusts to content
    position: "relative", // Ensure proper stacking
    paddingTop: "30px", // Add padding to offset the image overhang
  },
  cardContent: {
    display: "block !important", // Force block display
    "& .MuiCardHeader-root": {
      padding: "0", // Remove default padding to align image correctly
      marginTop: "-30px", // Pull the image up to align with the card top
      position: "relative",
      zIndex: 1, // Ensure image stays within card
    },
    "& .MuiCardContent-root": {
      padding: "16px",
      display: "block !important", // Ensure body is visible
    },
    "& img": {
      width: "100% !important", // Force image width
      height: "auto !important", // Maintain aspect ratio
      borderRadius: "8px 8px 0 0", // Match card rounding
      objectFit: "cover !important", // Ensure images scale properly
      display: "block !important", // Ensure image is visible
      marginTop: "0", // Remove any margin to align with card
    },
    "& h4": {
      margin: "0 0 8px !important", // Force spacing
      fontSize: "1.1rem !important", // Ensure title is readable
      color: blackColor, // Ensure title is visible
      display: "block !important", // Ensure title is visible
    },
    "& p": {
      margin: "0 !important", // Ensure description fits
      fontSize: "0.9rem !important", // Ensure description is readable
      color: grayColor[0], // Match Material-UI description color
      display: "block !important", // Ensure description is visible
    },
  },
  button: {
    marginTop: "16px",
    backgroundColor: "#e91e63", // Rose color from Material-UI
    "&:hover": {
      backgroundColor: "#d81b60",
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
    marginBottom: "20px",
    padding: "0 16px",
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    alignItems: "center",
  },
  searchPadding: {
    padding: "20px 0", // Maintain padding above/below search
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
    marginBottom: "60px", // Increase buffer below cards to 60px (20px more than current 40px)
  },
};

export default marketplaceStyle;