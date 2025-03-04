import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import makeStyles from '@mui/styles/makeStyles';
// core components
import Button from "/components/CustomButtons/Button.js"; // Import Button for buttonText
import styles from "/styles/jss/nextjs-material-kit-pro/components/cardStyle.js";

const useStyles = makeStyles(styles);

export default function Card(props) {
  const {
    className,
    children,
    plain,
    profile,
    blog,
    raised,
    background,
    pricing,
    color,
    product,
    testimonial,
    buttonText, // Add buttonText to props
    ...rest
  } = props;
  const classes = useStyles();
  const cardClasses = classNames({
    [classes.card]: true,
    [classes.cardPlain]: plain,
    [classes.cardProfile]: profile || testimonial,
    [classes.cardBlog]: blog,
    [classes.cardRaised]: raised,
    [classes.cardBackground]: background,
    [classes.cardPricingColor]:
      (pricing && color !== undefined) || (pricing && background !== undefined),
    [classes[color]]: color,
    [classes.cardPricing]: pricing,
    [classes.cardProduct]: product,
    [className]: className !== undefined
  });

  return (
    <div className={cardClasses} {...rest}>
      {children}
      {buttonText && (
        <div className={classes.buttonContainer}> {/* Optional: Add styling for button positioning */}
          <Button color="rose" round>
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
}

Card.propTypes = {
  className: PropTypes.string,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  blog: PropTypes.bool,
  raised: PropTypes.bool,
  background: PropTypes.bool,
  pricing: PropTypes.bool,
  testimonial: PropTypes.bool,
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "rose"
  ]),
  product: PropTypes.bool,
  children: PropTypes.node,
  buttonText: PropTypes.string, // Add buttonText to PropTypes
};

const useAdditionalStyles = makeStyles({
  buttonContainer: {
    padding: "15px",
    textAlign: "center",
  },
});

export { useAdditionalStyles }; // Optional: Export for custom styling if needed