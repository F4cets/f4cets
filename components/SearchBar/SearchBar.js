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
    padding: theme.spacing(1, 1, 1, 1), // Reduced padding-bottom to 2px
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.5, 0.5, 1, 0.5), // Reduced to 1px on mobile
    },
  },
  filterContainer: {
    width: "100%",
    padding: theme.spacing(0.25, 1, 1, 1), // Reduced padding-top to 2px
    marginTop: 0, // Eliminated marginTop
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.125, 0.5, 0.5, 0.5), // Reduced to 1px on mobile
    },
  },
  card: {
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)", // Reduced shadow vertical offset
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    margin: 0, // Override any default margins
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
      top: '-4px',
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0.5, 0),
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
  toggle: {
    margin: theme.spacing(0.5),
    width: "100%",
    '& .MuiToggleButton-root': {
      fontSize: '0.7rem',
      padding: '4px 8px',
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0.5, 0),
      display: "flex",
      justifyContent: "center",
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
                  {/* Top Row: RWI Toggle and Price Slider */}
                  <GridItem xs={12} sm={6} md={5}>
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
                  </GridItem>
                  <GridItem xs={12} sm={6} md={5}>
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
                          { value: 50, label: "0 USDC" },
                          { value: 950, label: "1000 USDC" },
                        ]}
                      />
                    </div>
                  </GridItem>
                  {/* Bottom Row: Categories and Apply Button */}
                  <GridItem xs={12} sm={6} md={5}>
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
                  <GridItem xs={12} sm={6} md={5}>
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