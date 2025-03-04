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
    overflow: "hidden",
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
  },
};

export default marketplaceStyle;