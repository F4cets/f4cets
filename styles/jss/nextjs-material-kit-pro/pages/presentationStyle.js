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
    /*overflow: "hidden"*/ // Fixed syntax: removed unnecessary comment slashes
  },
  mainRaised,
  parallax: {
    height: "90vh",
    overflow: "hidden",
    backgroundPosition: "center center", // Changed to center for consistency across devices
    backgroundSize: "cover", // Ensures image scales properly
    "@media (max-width: 576px)": {
      height: "50vh", // Further reduced height for mobile to fit content
      backgroundPosition: "center center", // Keeps image centered on mobile
      backgroundSize: "cover" // Ensures no clipping or overflow
    }
  },
  container: {
    ...container,
    zIndex: 1,
    "@media (max-width: 576px)": {
      padding: "0 10px" // Consistent with original
    }
  },
  title: {
    ...title,
    color: whiteColor,
    "@media (max-width: 576px)": {
      fontSize: "1.8rem",
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
        fontSize: "2.2rem", // Slightly smaller for better fit
        lineHeight: "1.2"
      }
    },
    "& h3": {
      fontSize: "1.313rem",
      maxWidth: "500px",
      margin: "10px auto 0",
      wordWrap: "break-word", // Prevents text overflow
      "@media (max-width: 576px)": {
        fontSize: "0.9rem", // Slightly smaller for mobile
        maxWidth: "85%", // Adjusted to fit smaller screens
        margin: "5px auto",
        lineHeight: "1.3" // Improves readability
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
      fontSize: "14px", // Even smaller for mobile
      padding: "5px 8px",
      top: "-15px",
      right: "-5px"
    }
  }
};

export default presentationStyle;