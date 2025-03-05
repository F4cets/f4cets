import React, { useState } from "react";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import makeStyles from "@mui/styles/makeStyles"; // Import makeStyles for styling

const useStyles = makeStyles((theme) => ({
  search: {
    backgroundColor: theme.palette.common.white,
    borderRadius: "4px",
    maxWidth: "500px", // Match marketplaceStyle.js search maxWidth
    margin: "0 auto", // Center within the Grid item
    "& .MuiInputBase-root": {
      backgroundColor: theme.palette.common.white,
    },
  },
  filter: {
    minWidth: "150px",
    backgroundColor: theme.palette.common.white,
    borderRadius: "4px",
    "& .MuiSelect-select": {
      backgroundColor: theme.palette.common.white,
    },
  },
}));

export default function SearchBar({ onSearch, onFilter, categories = [] }) {
  const classes = useStyles(); // Use makeStyles to generate classes
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 900,
    categories: [],
    designers: [],
  });

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    onSearch(event.target.value);
  };

  const handleFilterChange = (field) => (event) => {
    const value = field === "categories" || field === "designers" 
      ? event.target.value 
      : parseFloat(event.target.value) || 0;
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
    onFilter({ ...filters, [field]: value });
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search sellers..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={classes.search} // Now defined with maxWidth and margin
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <FormControl fullWidth variant="outlined" className={classes.filter}>
          <InputLabel>Categories</InputLabel>
          <Select
            multiple
            value={filters.categories}
            onChange={handleFilterChange("categories")}
            label="Categories"
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={2}>
        <TextField
          fullWidth
          variant="outlined"
          label="Min Price (SOL)"
          type="number"
          value={filters.priceMin}
          onChange={handleFilterChange("priceMin")}
          className={classes.filter} // Now defined
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          variant="outlined"
          label="Max Price (SOL)"
          type="number"
          value={filters.priceMax}
          onChange={handleFilterChange("priceMax")}
          className={classes.filter} // Now defined
        />
      </Grid>
    </Grid>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string),
};

SearchBar.defaultProps = {
  categories: [],
};