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
  
  const affiliateStyle = {
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
      overflow: "hidden",
      display: "block",
      padding: "10px",
      minHeight: "300px",
      position: "relative",
      zIndex: 0,
      boxShadow: `0 4px 6px rgba(${hexToRgb(blackColor)}, 0.1)`,
      cursor: "pointer", // Add pointer cursor for clickable effect
    },
    cardImage: {
      width: "100%",
      height: "150px",
      borderRadius: "8px 8px 0 0",
      objectFit: "cover",
    },
    cardTitle: {
      margin: "10px 0 5px",
      fontSize: "1.2rem",
      fontWeight: "500",
      color: blackColor,
      textAlign: "center",
    },
    description: {
      margin: "0 0 10px",
      fontSize: "0.9rem",
      color: grayColor[0],
      textAlign: "center",
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
      padding: "20px 0",
    },
    search: {
      flexGrow: 0,
      width: "100%",
      maxWidth: "600px",
      margin: "0 10px",
      backgroundColor: whiteColor,
      borderRadius: "4px",
      "& .MuiInputBase-root": {
        backgroundColor: whiteColor,
        height: "48px",
      },
      "& .MuiInputBase-input": {
        padding: "10px 14px",
      },
      "@media (min-width: 600px)": {
        width: "600px",
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
      padding: "0 20px",
      marginTop: "20px",
      marginBottom: "20px",
      position: "relative",
      zIndex: 0,
      minHeight: "300px",
    },
  };
  
  export default affiliateStyle;