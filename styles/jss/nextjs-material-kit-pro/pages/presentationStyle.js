import {
  container,
  title,
  main,
  whiteColor,
  grayColor,
  mainRaised,
  hexToRgb
} from "/styles/jss/nextjs-material-kit-pro.js";
import footerStyle from "/styles/jss/nextjs-material-kit-pro/pages/componentsSections/footerStyle.js";

const presentationStyle = {
  ...footerStyle,
  main: {
    ...main
    /*overflow: "hidden"*/
  },
  mainRaised,
  parallax: {
    height: "90vh",
    overflow: "hidden",
    backgroundPosition: "center top",
    "@media (max-width: 576px)": {
      height: "60vh", // Reduced height for mobile to prevent overflow
      backgroundPosition: "center center"
    }
  },
  container: {
    ...container,
    zIndex: 1,
    "@media (max-width: 576px)": {
      padding: "0 10px" // Reduced padding for mobile
    }
  },
  title: {
    ...title,
    color: whiteColor,
    "@media (max-width: 576px)": {
      fontSize: "1.8rem", // Smaller font size for mobile
      marginBottom: "10px"
    }
  },
  brand: {
    color: whiteColor,
    textAlign: "center",
    "& h1": {
      fontSize: "4.2rem",
      fontWeight: "600",
      display: "inline-block",
      position: "relative",
      "@media (max-width: 576px)": {
        fontSize: "2.5rem", // Reduced font size for mobile
        lineHeight: "1.2"
      }
    },
    "& h3": {
      fontSize: "1.313rem",
      maxWidth: "500px",
      margin: "10px auto 0",
      "@media (max-width: 576px)": {
        fontSize: "1rem", // Smaller subtitle on mobile
        maxWidth: "90%", // Prevent overflow
        margin: "5px auto"
      }
    }
  },
  proBadge: {
    position: "relative",
    fontSize: "22px",
    textTransform: "uppercase",
    fontWeight: "700",
    right: "-10px",
    padding: "10px 18px",
    top: "-30px",
    background: whiteColor,
    borderRadius: "3px",
    color: grayColor[18],
    lineHeight: "22px",
    boxShadow: "0 5px 5px -2px rgba(" + hexToRgb(grayColor[25]) + ",.4)",
    "@media (max-width: 576px)": {
      fontSize: "16px", // Smaller badge on mobile
      padding: "5px 10px",
      top: "-20px",
      right: "-5px"
    }
  }
};

export default presentationStyle;