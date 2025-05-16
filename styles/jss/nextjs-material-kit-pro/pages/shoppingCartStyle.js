import {
  container,
  title,
  cardTitle,
  main,
  mainRaised,
  mrAuto,
  whiteColor,
  grayColor,
  mlAuto
} from "/styles/jss/nextjs-material-kit-pro.js";
import buttonGroup from "/styles/jss/nextjs-material-kit-pro/buttonGroupStyle.js";
import tooltips from "/styles/jss/nextjs-material-kit-pro/tooltipsStyle.js";

const styles = {
  main,
  mainRaised,
  mrAuto,
  mlAuto,
  cardTitle,
  ...buttonGroup,
  ...tooltips,
  container: {
    ...container,
    zIndex: 1
  },
  title: {
    ...title,
    "&, & + h4": {
      color: whiteColor
    },
    fontSize: "1.5rem"
  },
  block: {
    color: "inherit",
    padding: "0.9375rem",
    fontWeight: "500",
    fontSize: "12px",
    textTransform: "uppercase",
    borderRadius: "3px",
    textDecoration: "none",
    position: "relative",
    display: "block"
  },
  inlineBlock: {
    display: "inline-block",
    padding: "0px",
    width: "auto"
  },
  list: {
    marginBottom: "0",
    padding: "0",
    marginTop: "0"
  },
  left: {
    float: "left!important",
    display: "block"
  },
  right: {
    padding: "15px 0",
    margin: "0",
    float: "right"
  },
  icon: {
    width: "18px",
    height: "18px",
    top: "3px",
    position: "relative"
  },
  imgContainer: {
    width: "120px",
    maxHeight: "160px",
    overflow: "hidden",
    display: "block",
    "& img": {
      width: "100%"
    }
  },
  description: {
    maxWidth: "150px"
  },
  tdName: {
    minWidth: "200px",
    fontWeight: "400",
    fontSize: "1.125em" // Reduced for smaller product name
  },
  tdNameAnchor: {
    color: grayColor[1]
  },
  tdNameSmall: {
    color: grayColor[0],
    fontSize: "0.75em",
    fontWeight: "300"
  },
  tdNumber: {
    textAlign: "right",
    minWidth: "150px",
    fontWeight: "300",
    fontSize: "1em !important" // Unified font size for Price
  },
  tdNumberSmall: {
    marginRight: "3px"
  },
  tdNumberAndButtonGroup: {
    textAlign: "right",
    padding: "0.9375rem",
    lineHeight: "1.5em"
  },
  customFont: {
    fontSize: "1em !important" // Unified font size for Color/Size
  },
  actionButton: {
    margin: "0px",
    padding: "5px"
  },
  textCenter: {
    textAlign: "center"
  },
  textRight: {
    textAlign: "right"
  },
  // Mobile styles
  mobileCard: {
    padding: "15px",
    margin: "15px 0",
    border: `1px solid ${grayColor[2]}`, // Lighter border for elegance
    borderRadius: "12px", // Increased for rounded corners
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f9f9f9", // Off-white for floating effect
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Soft shadow for lift
    transition: "box-shadow 0.3s ease", // Hover effect
    "&:hover": {
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)" // Deeper shadow on hover
    }
  },
  mobileImg: {
    width: "100px",
    height: "auto",
    marginBottom: "15px"
  },
  mobileDetails: {
    textAlign: "center",
    width: "100%"
  },
  mobileButtonGroup: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "10px 0",
    gap: "15px"
  },
  mobileTotal: {
    fontSize: "1.2rem",
    fontWeight: "500",
    margin: "10px 0"
  },
  desktopView: {
    "@media (max-width: 959px)": {
      display: "none" // Hide on mobile
    }
  },
  mobileView: {
    "@media (min-width: 960px)": {
      display: "none" // Hide on desktop
    }
  },
  // Quantity styles
  quantityNumber: {
    fontWeight: "bold",
    margin: "0 5px",
    fontSize: "1em" // Unified font size for Qty
  },
  mobileQuantityNumber: {
    fontWeight: "bold"
  },
  // Custom Parallax style for adjusted header size
  parallaxSmall: {
    height: "400px",
    "@media (max-width: 959px)": {
      height: "300px"
    }
  },
  // Button group styles
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "5px",
    "& button": {
      borderRadius: "50px !important",
      padding: "5px",
      minWidth: "30px",
      height: "30px",
      lineHeight: "1",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "& svg": {
        margin: "0 auto",
        display: "block"
      }
    }
  },
  // Pronounced remove button for mobile
  removeButton: {
    backgroundColor: "#e91e63",
    color: whiteColor,
    borderRadius: "20px",
    padding: "8px 12px",
    fontSize: "1rem",
    fontWeight: "600",
    minWidth: "40px",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      backgroundColor: "#c2185b"
    },
    "& svg": {
      fontSize: "1.5rem",
      margin: "0 auto"
    }
  },
  // Style to center remove button on mobile
  removeButtonContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    marginTop: "10px"
  },
  // Override tableShopping to remove "Total" text
  tableShopping: {
    '& tfoot::before': {
      display: 'none !important',
    },
    '& .table-shopping-total': {
      display: 'none !important',
    },
    '& .table-shopping-amount': {
      display: 'none !important',
    },
    '& .table-total': {
      display: 'none !important',
    },
    '& .table-shopping-footer': {
      display: 'none !important',
    },
    '& tfoot': {
      display: 'none !important',
    },
    '& .makeStyles-tableCellTotal-649': {
      display: 'none !important', // Target specific tableCellTotal class
    },
    '& [class*="makeStyles-tableCellTotal-"]': {
      display: 'none !important', // Target dynamic tableCellTotal classes
    },
  },
};

export default styles;