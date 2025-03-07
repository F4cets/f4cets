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
      overflow: "visible",
      display: "flex",
      flexDirection: "column",
      padding: "10px",
      minHeight: "300px", // Increased for visibility
      position: "relative",
      zIndex: 0,
      border: "2px solid red", // Debugging border
    },
    cardContent: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      "& .MuiCardHeader-root": {
        padding: "0",
      },
      "& .MuiCardContent-root": {
        padding: "0",
        flexGrow: 1,
      },
      "& img": {
        width: "100%",
        height: "150px",
        borderRadius: "8px 8px 0 0",
        objectFit: "cover",
        marginBottom: "10px",
      },
      "& h4": {
        margin: "0 0 8px",
        fontSize: "1.1rem",
        color: blackColor,
      },
      "& p": {
        margin: "0",
        fontSize: "0.9rem",
        color: grayColor[0],
      },
    },
    cardImage: {
      width: "100%",
      height: "150px",
      borderRadius: "8px 8px 0 0",
      objectFit: "cover",
    },
    cardTitle: {
      margin: "0 0 8px",
      fontSize: "1.1rem",
      color: blackColor,
    },
    cardFooter: {
      padding: "0",
      display: "flex",
      justifyContent: "center",
      fontSize: "0.75rem",
      color: grayColor[0],
    },
    button: {
      marginTop: "16px",
      backgroundColor: "#e91e63",
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
      minHeight: "300px", // Ensure grid has space
    },
  };
  
  export default affiliateStyle;