import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  search: {
    backgroundColor: theme.palette.common.white,
    borderRadius: "4px",
    maxWidth: "500px",
    margin: "0 auto",
    "& .MuiInputBase-root": {
      backgroundColor: theme.palette.common.white,
    },
    [theme.breakpoints.down('sm')]: { // Stack on mobile
      maxWidth: "100%", // Full width on mobile
      margin: "0",
    },
  },
  filter: {
    minWidth: "150px",
    backgroundColor: theme.palette.common.white,
    borderRadius: "4px",
    "& .MuiSelect-select": {
      backgroundColor: theme.palette.common.white,
    },
    [theme.breakpoints.down('sm')]: { // Stack on mobile
      minWidth: "100%", // Full width on mobile
    },
  },
  gridContainer: {
    [theme.breakpoints.down('sm')]: { // Stack vertically on mobile
      flexDirection: "column",
      alignItems: "stretch",
      padding: "0 10px", // Add padding for mobile
    },
  },
}));

export default function SearchBar({ onSearch, onFilter, searchQuery, filters, categories = [] }) {
  const classes = useStyles();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || "");
  const [localFilters, setLocalFilters] = useState(filters || {
    priceMin: undefined, // Changed from 0 to undefined
    priceMax: undefined, // Changed from 900 to undefined
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
    onSearch(query, localFilters);
  };

  const handleFilterChange = (field) => (event) => {
    const value = event.target.value === "" 
      ? undefined // Allow clearing to undefined
      : field === "categories" || field === "designers" 
        ? event.target.value 
        : parseFloat(event.target.value) || 0;
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <Grid container spacing={2} alignItems="center" className={classes.gridContainer}>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search sellers..."
          value={localSearchQuery}
          onChange={handleSearchChange}
          className={classes.search}
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
          value={localFilters.priceMin === undefined ? "" : localFilters.priceMin} // Show empty if undefined
          onChange={handleFilterChange("priceMin")}
          className={classes.filter}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          variant="outlined"
          label="Max Price (SOL)"
          type="number"
          value={localFilters.priceMax === undefined ? "" : localFilters.priceMax} // Show empty if undefined
          onChange={handleFilterChange("priceMax")}
          className={classes.filter}
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
    priceMin: undefined, // Changed from 0 to undefined
    priceMax: undefined, // Changed from 900 to undefined
    categories: [],
    designers: [],
  },
};