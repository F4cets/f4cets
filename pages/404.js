/*eslint-disable*/
import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import { useRouter } from 'next/router';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// core components
import Header from "/components/Header/Header.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";

import errorPageStyle from "/styles/jss/nextjs-material-kit-pro/pages/errorPageStyles.js";

const useStyles = makeStyles(errorPageStyle);

export default function ErrorPage({ ...rest }) {
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  const classes = useStyles();
  const router = useRouter();

  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-500 min-h-screen text-white">
      <Header
        absolute
        color="transparent"
        brand="F4cets"
        links={<HeaderLinks dropdownHoverColor="dark" />}
        rightLinks={<WalletMultiButton />}
        {...rest}
      />
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url('/img/clint-mckoy.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div className={classes.contentCenter}>
          <GridContainer>
            <GridItem md={12}>
              <h1 className={classes.title}>404</h1>
              <h2 className={classes.subTitle}>Page not found :(</h2>
              <h4 className={classes.description}>
                Ooooups! Looks like you got lost.
              </h4>
            </GridItem>
          </GridContainer>
        </div>
      </div>
      {/* Global footer will render here */}
    </div>
  );
}