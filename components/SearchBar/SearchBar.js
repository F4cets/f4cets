import React, { useState } from "react";
import classNames from "classnames";
import makeStyles from "@mui/styles/makeStyles";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Card from "/components/Card/Card.js";
import CardBody from "/components/Card/CardBody.js";
import CustomInput from "/components/CustomInput/CustomInput.js";
import Button from "/components/CustomButtons/Button.js";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Slider from "@mui/material/Slider";
import Search from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

const useStyles = makeStyles((theme) => ({
  searchContainer: {
    width: "100%",
    padding: theme.spacing(1, 1, 1, 1),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.5, 0.5, 1, 0.5),
    },
  },
  filterContainer: {
    width: "100%",
    padding: theme.spacing(0.25, 1, 1, 1),
    marginTop: 0,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.125, 0.5, 0.5, 0.5),
    },
  },
  card: {
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    margin: 0,
  },
  cardBody: {
    padding: theme.spacing(1, 2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.5, 1.5),
    },
  },
  formControl: {
    width: "100%",
    margin: theme.spacing(0.5),
    '& .MuiInputBase-root': {
      fontSize: '0.75rem',
      height: '28px',
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.75rem',
      top: '-40px', // Moved up ~20px from -8px
      transform: 'translate(0, 24px) scale(1)', // Adjusted starting position
      '&.MuiInputLabel-shrink': {
        transform: 'translate(0, -8px) scale(0.75)', // Adjusted shrink position
      },
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0.5, 0),
      '& .MuiInputLabel-root': {
        top: '-8px', // Revert to original for mobile
        transform: 'translate(0, 16px) scale(1)',
        '&.MuiInputLabel-shrink': {
          transform: 'translate(0, -6px) scale(0.75)',
        },
      },
    },
  },
  toggle: {
    margin: theme.spacing(0.5),
    width: "100%",
    paddingTop: theme.spacing(1.5), // Increased padding for label clearance
    '& .MuiToggleButton-root': {
      fontSize: '0.7rem',
      padding: '4px 8px',
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0.5, 0),
      display: "flex",
      justifyContent: "center",
      paddingTop: theme.spacing(0.5),
    },
  },
  input: {
    width: "100%",
    margin: theme.spacing(0.5),
    '& .MuiInputBase-input': {
      fontSize: '0.75rem',
      height: '28px',
      padding: '4px 8px',
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0.5, 0),
    },
  },
  sliderContainer: {
    width: "100%",
    margin: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
    '& .MuiSlider-root': {
      height: '4px',
      '& .MuiSlider-thumb': {
        width: '10px',
        height: '10px',
      },
      '& .MuiSlider-valueLabel': {
        fontSize: '0.65rem',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.75rem',
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0.5, 0),
      padding: theme.spacing(0, 1),
    },
  },
  button: {
    margin: theme.spacing(0.5),
    width: "100%",
    fontSize: '0.75rem',
    padding: '4px 8px',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0.5, 0),
    },
  },
  mlAuto: {
    marginLeft: "auto",
  },
  mrAuto: {
    marginRight: "auto",
  },
}));

export default function SearchBar({ onSearch, onFilter, searchQuery, filters, categories }) {
  const classes = useStyles();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setLocalQuery(newQuery);
    onSearch(newQuery, localFilters);
  };

  const handleCategoryChange = (e) => {
    setLocalFilters({ ...localFilters, categories: e.target.value });
  };

  const handleTypeChange = (e, newType) => {
    if (newType !== null) {
      setLocalFilters({ ...localFilters, type: newType });
    }
  };

  const handleViewChange = (e, newView) => {
    if (newView !== null) {
      setLocalFilters({ ...localFilters, view: newView });
    }
  };

  const handlePriceRangeChange = (e, newValue) => {
    setLocalFilters({ ...localFilters, priceRange: newValue });
  };

  const handleApply = () => {
    onFilter(localFilters);
  };

  return (
    <div>
      {/* Top Search Area: Instant Search */}
      <div className={classes.searchContainer}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8} className={classNames(classes.mlAuto, classes.mrAuto)}>
            <Card raised className={classes.card}>
              <CardBody className={classes.cardBody}>
                <GridContainer spacing={1} justifyContent="center" alignItems="center">
                  <GridItem xs={12}>
                    <CustomInput
                      id="marketplaceSearch"
                      formControlProps={{
                        fullWidth: true,
                        className: classes.input,
                      }}
                      inputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                        placeholder: "Search stores or products...",
                        value: localQuery,
                        onChange: handleSearchChange,
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>

      {/* Bottom Search Area: Filters */}
      <div className={classes.filterContainer}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8} className={classNames(classes.mlAuto, classes.mrAuto)}>
            <Card raised className={classes.card}>
              <CardBody className={classes.cardBody}>
                <GridContainer spacing={1} justifyContent="center" alignItems="center">
                  {/* Top Row: Product Type Toggle, View Toggle, and Price Slider */}
                  <GridItem xs={12} sm={6} md={4}>
                    <FormControl fullWidth className={classes.formControl}>
                      <InputLabel>Product Type</InputLabel>
                      <ToggleButtonGroup
                        value={localFilters.type}
                        exclusive
                        onChange={handleTypeChange}
                        className={classes.toggle}
                      >
                        <ToggleButton value="all">All</ToggleButton>
                        <ToggleButton value="digital">Digital</ToggleButton>
                        <ToggleButton value="rwi">RWI</ToggleButton>
                      </ToggleButtonGroup>
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={6} md={4}>
                    <FormControl fullWidth className={classes.formControl}>
                      <InputLabel>View</InputLabel>
                      <ToggleButtonGroup
                        value={localFilters.view || "all"}
                        exclusive
                        onChange={handleViewChange}
                        className={classes.toggle}
                      >
                        <ToggleButton value="all">All</ToggleButton>
                        <ToggleButton value="store">Stores</ToggleButton>
                        <ToggleButton value="product">Products</ToggleButton>
                      </ToggleButtonGroup>
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={6} md={4}>
                    <div className={classes.sliderContainer}>
                      <InputLabel>Price Range (USDC)</InputLabel>
                      <Slider
                        value={localFilters.priceRange}
                        onChange={handlePriceRangeChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={1000}
                        step={10}
                        marks={[
                          { value: 50, label: "$0" },
                          { value: 950, label: "$1000" },
                        ]}
                      />
                    </div>
                  </GridItem>
                  {/* Bottom Row: Categories and Apply Button */}
                  <GridItem xs={12} sm={6} md={6}>
                    <FormControl fullWidth className={classes.formControl}>
                      <InputLabel>Categories</InputLabel>
                      <Select
                        multiple
                        value={localFilters.categories}
                        onChange={handleCategoryChange}
                        label="Categories"
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={6} md={6}>
                    <Button
                      color="info"
                      onClick={handleApply}
                      className={classes.button}
                    >
                      Apply Filters
                    </Button>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}