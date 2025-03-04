import React from "react";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import styles from "/styles/jss/nextjs-material-kit-pro/pages/marketplaceStyle.js";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles(styles);

export default function SearchBar({ onSearch, onFilter }) {
  const classes = useStyles();
  const [filters, setFilters] = React.useState({
    priceMin: 0,
    priceMax: 900,
    categories: [],
    designers: [],
  });

  const handleSearch = (event) => {
    onSearch(event.target.value);
  };

  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (type === "priceMin" || type === "priceMax") {
        newFilters[type] = parseInt(value, 10) || 0;
      } else {
        const index = newFilters[type].indexOf(value);
        if (index === -1) {
          newFilters[type] = [...newFilters[type], value];
        } else {
          newFilters[type] = newFilters[type].filter((v) => v !== value);
        }
      }
      onFilter(newFilters);
      return newFilters;
    });
  };

  return (
    <div className={classes.searchContainer}>
      <TextField
        placeholder="Search sellers..."
        onChange={handleSearch}
        className={classes.search}
        variant="outlined"
      />
      <Select
        value="all"
        onChange={(e) => handleFilterChange("categories", e.target.value)}
        className={classes.filter}
        variant="outlined"
      >
        <MenuItem value="all">All Categories</MenuItem>
        <MenuItem value="art">Art</MenuItem>
        <MenuItem value="crafts">Crafts</MenuItem>
        <MenuItem value="jewelry">Jewelry</MenuItem>
      </Select>
      <Select
        value="all"
        onChange={(e) => handleFilterChange("designers", e.target.value)}
        className={classes.filter}
        variant="outlined"
      >
        <MenuItem value="all">All Designers</MenuItem>
        <MenuItem value="seller1">Seller 1</MenuItem>
        <MenuItem value="seller2">Seller 2</MenuItem>
      </Select>
      <TextField
        label="Min Price (SOL)"
        type="number"
        value={filters.priceMin}
        onChange={(e) => handleFilterChange("priceMin", e.target.value)}
        className={classes.filter}
        variant="outlined"
        InputProps={{ inputProps: { min: 0 } }}
      />
      <TextField
        label="Max Price (SOL)"
        type="number"
        value={filters.priceMax}
        onChange={(e) => handleFilterChange("priceMax", e.target.value)}
        className={classes.filter}
        variant="outlined"
        InputProps={{ inputProps: { min: 0 } }}
      />
    </div>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
};