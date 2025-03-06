import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import makeStyles from "@mui/styles/makeStyles";
import styles from "/styles/jss/nextjs-material-kit-pro/components/affiliateSearchStyle.js";

const useStyles = makeStyles(styles);

export default function AffiliateSearchBar({ onSearch, searchQuery }) {
  const classes = useStyles();

  const handleSearchChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <div className={classes.root}>
      <TextField
        placeholder="Search Affiliates"
        value={searchQuery}
        onChange={handleSearchChange}
        className={classes.search}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end" color="primary">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}