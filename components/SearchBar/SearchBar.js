import React, { useState, useEffect } from "react";
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

export default function SearchBar({ onSearch, onFilter, searchQuery, filters, categories = [] }) {
  const classes = useStyles(); // Use makeStyles to generate classes
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || "");
  const [localFilters, setLocalFilters] = useState(filters || {
    priceMin: 0,
    priceMax: 900,
    categories: [],
    designers: [],
  });

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setLocalSearchQuery(query);
    onSearch(query, localFilters); // Pass search query and current filters
  };

  const handleFilterChange = (field) => (event) => {
    const value = field === "categories" || field === "designers" 
      ? event.target.value 
      : parseFloat(event.target.value) || 0;
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search sellers..."
          value={localSearchQuery}
          onChange={handleSearchChange}
          className={classes.search} // Now defined with maxWidth and margin
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <FormControl fullWidth variant="outlined" className={classes.filter}>
          <InputLabel>Categories</InputLabel>
          <Select
            multiple
            value={localFilters.categories}
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
          value={localFilters.priceMin}
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
          value={localFilters.priceMax}
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
  searchQuery: PropTypes.string,
  filters: PropTypes.shape({
    priceMin: PropTypes.number,
    priceMax: PropTypes.number,
    categories: PropTypes.arrayOf(PropTypes.string),
    designers: PropTypes.arrayOf(PropTypes.string),
  }),
  categories: PropTypes.arrayOf(PropTypes.string),
};

SearchBar.defaultProps = {
  categories: [],
  searchQuery: "",
  filters: {
    priceMin: 0,
    priceMax: 900,
    categories: [],
    designers: [],
  },
};