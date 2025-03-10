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
    backgroundPosition: "center center",
    backgroundSize: "cover",
    "@media (max-width: 576px)": {
      height: "50vh",
      backgroundPosition: "center center",
      backgroundSize: "cover"
    }
  },
  container: {
    ...container,
    zIndex: 1,
    "@media (max-width: 576px)": {
      padding: "0 10px"
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
        fontSize: "2.2rem",
        lineHeight: "1.2"
      }
    },
    "& h3": {
      fontSize: "1.313rem",
      maxWidth: "500px",
      margin: "10px auto 0",
      wordWrap: "break-word",
      "@media (max-width: 576px)": {
        fontSize: "0.9rem",
        maxWidth: "85%",
        margin: "5px auto",
        lineHeight: "1.3"
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
      fontSize: "14px",
      padding: "5px 8px",
      top: "-15px",
      right: "-5px"
    }
  },
  footer: {
    padding: "0.9375rem 0",
    textAlign: "center",
    display: "flex",
    zIndex: "2",
    position: "relative",
    "& ul": {
      marginBottom: "0",
      padding: 0,
      listStyle: "none"
    },
    "@media (max-width: 960px)": {
      flexDirection: "column !important",
      alignItems: "center !important",
      justifyContent: "center",
      "& > div": {
        width: "100%",
        marginBottom: "15px",
        float: "none !important",
        textAlign: "center"
      }
    }
  },
  left: {
    float: "left!important",
    display: "block",
    "@media (max-width: 960px)": {
      float: "none !important",
      display: "block",
      width: "100%",
      textAlign: "center"
    }
  },
  pullCenter: {
    display: "inline-block",
    float: "none!important",
    "@media (max-width: 960px)": {
      width: "100%",
      textAlign: "center",
      "& .MuiList-root": {
        display: "flex",
        flexDirection: "row", // Horizontal layout for links
        flexWrap: "wrap", // Wrap if too long
        justifyContent: "center", // Center horizontally
        alignItems: "center",
        width: "100%",
        "& .MuiListItem-root": {
          width: "auto",
          display: "inline-block", // Inline for horizontal layout
          margin: "0 10px", // Space between links
          textAlign: "center"
        }
      }
    }
  },
  rightLinks: {
    float: "right!important",
    "& ul": {
      marginBottom: 0,
      padding: 0,
      listStyle: "none",
      "& li": {
        display: "inline-block"
      },
      "& a": {
        display: "block",
        marginLeft: "4px"
      }
    },
    "@media (max-width: 960px)": {
      float: "none !important",
      width: "100%",
      textAlign: "center",
      "& ul": {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        "& li": {
          margin: "0 10px"
        }
      }
    }
  },
  list: {
    marginBottom: "0",
    padding: "0",
    marginTop: "0",
    "@media (max-width: 960px)": {
      display: "flex",
      flexDirection: "row", // Match pullCenter for consistency
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      "& li": {
        margin: "0 10px" // Match spacing
      }
    }
  },
  inlineBlock: {
    display: "inline-block",
    padding: "0px",
    width: "auto",
    "@media (max-width: 960px)": {
      display: "inline-block", // Keep inline for horizontal layout
      width: "auto"
    }
  },
  footerBrand: {
    color: grayColor[8],
    height: "auto",
    padding: "10px",
    fontWeight: "500",
    fontSize: "18px",
    textDecoration: "none",
    "&:hover": {
      color: grayColor[1]
    },
    "@media (max-width: 960px)": {
      marginLeft: "0",
      display: "block",
      width: "100%",
      textAlign: "center"
    }
  }
};

export default presentationStyle;