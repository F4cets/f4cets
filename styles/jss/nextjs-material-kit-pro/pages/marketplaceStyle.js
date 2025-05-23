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
      transform: "scale(1.05) rotate(5deg)",
      boxShadow: `0 12px 20px -10px rgba(${hexToRgb(blackColor)}, 0.28)`,
    },
    backgroundColor: whiteColor,
    color: blackColor,
    borderRadius: "8px",
    overflow: "visible", // Ensure content isn’t hidden
    display: "flex", // Use flex to ensure content layout
    flexDirection: "column", // Stack content vertically
    padding: "10px", // Add equal padding inside the card
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1, // Allow content to fill the card
    "& .MuiCardHeader-root": {
      padding: "0", // Remove default padding, use card padding
    },
    "& .MuiCardContent-root": {
      padding: "0", // Remove default padding, use card padding
      flexGrow: 1, // Allow content to expand
    },
    "& img": {
      width: "100%", // Ensure images fill the card width
      height: "150px", // Reduced height to fit inside with padding
      borderRadius: "8px 8px 0 0", // Match card rounding
      objectFit: "cover", // Ensure images scale properly
      marginBottom: "10px", // Add padding below image
    },
    "& h4": {
      margin: "0 0 8px", // Space below title
      fontSize: "1.1rem", // Ensure title is readable
      color: blackColor, // Ensure title is visible
    },
    "& p": {
      margin: "0", // Ensure description fits
      fontSize: "0.9rem", // Ensure description is readable
      color: grayColor[0], // Match Material-UI description color
    },
  },
  cardImage: {
    width: "100%", // Ensure images fill the card width
    height: "150px", // Reduced height to fit inside with padding
    borderRadius: "8px 8px 0 0", // Match card rounding
    objectFit: "cover", // Ensure images scale properly
  },
  cardTitle: {
    margin: "0 0 8px", // Space below title
    fontSize: "1.1rem", // Ensure title is readable
    color: blackColor, // Ensure title is visible
  },
  cardFooter: {
    padding: "0", // Remove default padding, use card padding
    display: "flex",
    justifyContent: "center", // Center the button
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
      zIndex: "1",
      width: "100%",
      height: "100%",
      display: "block",
      left: "0",
      top: "0",
      content: "''",
      backgroundColor: "rgba(" + hexToRgb(blackColor) + ",0.66)",
    },
  },
  subscribeLineImage: {
    position: "relative",
    backgroundPosition: "top center",
    backgroundSize: "cover",
    "& $container": {
      zIndex: "2",
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
    paddingLeft: "20px",
    paddingRight: "20px",
    display: "flex",
    gap: "16px",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  searchPadding: {
    padding: "20px 0", // Maintain padding above/below search
  },
  search: {
    flexGrow: 0, // Remove expansion to respect padding
    maxWidth: "500px",
    margin: "0 10px", // Add small margins for spacing within searchContainer
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
    padding: "0 20px", // Ensure consistent padding with search bar
    marginTop: "20px",
    marginBottom: "20px", // Match padding above search bar (20px)
  },
};

export default marketplaceStyle;