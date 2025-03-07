import {
  whiteColor,
} from "/styles/jss/nextjs-material-kit-pro.js";

const affiliateSearchStyle = {
  root: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0", // Remove padding to avoid overlap with searchPadding
    position: "relative", // Ensure proper stacking
    zIndex: 1, // Ensure search bar doesn’t overlap cards
  },
  search: {
    flexGrow: 0,
    width: "100%", // Default to full width on small screens
    maxWidth: "600px", // Larger default width
    margin: "0 10px",
    backgroundColor: whiteColor,
    borderRadius: "4px",
    "& .MuiInputBase-root": {
      backgroundColor: whiteColor,
      height: "48px", // Consistent height for better appearance
    },
    "& .MuiInputBase-input": {
      padding: "10px 14px", // Adjust padding for larger input
    },
    "@media (min-width: 600px)": {
      width: "600px", // Fixed width on medium/large screens
    },
  },
};

export default affiliateSearchStyle;