import {
  container,
  title,
  sectionDark,
  mlAuto,
  hexToRgb,
  grayColor,
  whiteColor
} from "/styles/jss/nextjs-material-kit-pro.js";

const cardsStyle = {
  section: {
    padding: "70px 0",
    textAlign: "center"
  },
  sectionDark: {
    ...sectionDark,
    backgroundColor: grayColor[18]
  },
  container: {
    ...container,
    zIndex: "2",
    position: "relative"
  },
  gridContainer: {
    "@media (min-width: 960px)": {
      flexDirection: "row", // Horizontal layout on desktop
      alignItems: "center"
    }
  },
  imageGridItem: {
    textAlign: "center"
  },
  textGridItem: {
    textAlign: "center",
    "@media (min-width: 960px)": {
      textAlign: "left" // Left-align text on desktop
    }
  },
  imageContainer: {
    maxWidth: "100%",
    "& img": {
      maxWidth: "100%",
      height: "auto",
      display: "block",
      margin: "0 auto", // Center image horizontally
      "@media (max-width: 576px)": {
        width: "90%" // Slightly smaller on mobile to fit screen
      }
    }
  },
  sectionDescription: {
    marginTop: "20px",
    "@media (min-width: 960px)": {
      marginTop: "0" // No top margin on desktop when side-by-side
    }
  },
  title: {
    ...title,
    color: whiteColor,
    marginBottom: "1rem",
    "@media (max-width: 576px)": {
      fontSize: "1.8rem" // Smaller title on mobile
    }
  },
  description: {
    color: whiteColor,
    "& h6": {
      fontSize: "1.125rem",
      fontWeight: "400",
      marginBottom: "10px",
      "@media (max-width: 576px)": {
        fontSize: "0.9rem"
      }
    },
    "& h5": {
      fontSize: "1rem",
      lineHeight: "1.5",
      fontWeight: "300",
      maxWidth: "100%",
      wordWrap: "break-word", // Prevent text overflow
      "@media (max-width: 576px)": {
        fontSize: "0.875rem",
        padding: "0 10px" // Add padding to keep text within bounds
      }
    }
  },
  mlAuto: {
    ...mlAuto
  }
};

export default cardsStyle;