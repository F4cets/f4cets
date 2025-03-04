/*!

=========================================================
* NextJS Material Kit PRO v1.3.1 based on Material Kit PRO - v2.0.2 (Bootstrap 4.0.0 Final Edition) and Material Kit PRO React v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-kit-pro
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import App from "next/app";
import Head from "next/head";
import { ThemeProvider, createTheme, StyledEngineProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles"; // Import for JSS

import "/styles/scss/nextjs-material-kit-pro.scss";
import "/styles/css/react-demo.css";
import "animate.css/animate.min.css";

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Default styles for wallet modal
import '@solana/wallet-adapter-react-ui/styles.css';

// Import Footer, List, ListItem, and Button components
import Footer from "/components/Footer/Footer.js";
import presentationStyle from "/styles/jss/nextjs-material-kit-pro/pages/presentationStyle.js";
import List from "@mui/material/List"; // Import for List
import ListItem from "@mui/material/ListItem"; // Import for ListItem
import Button from "/components/CustomButtons/Button.js"; // Added import for Button

const theme = createTheme({
  components: {
    MuiSelect: {
      defaultProps: {
        variant: "standard",
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "#fff !important",
          },
        },
      },
    },
  },
});

// Create styles for footer content (matching presentation.js)
const useFooterStyles = makeStyles(presentationStyle);

function MyApp({ Component, pageProps }) {
  // Add componentDidMount effect as useEffect for function component
  React.useEffect(() => {
    const comment = document.createComment(`

=========================================================
* NextJS Material Kit PRO v1.3.1 based on Material Kit PRO - v2.0.2 (Bootstrap 4.0.0 Final Edition) and Material Kit PRO React v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-kit-pro
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    `);
    document.insertBefore(comment, document.documentElement);
  }, []);

  // Configure Solana network (e.g., mainnet, devnet, testnet)
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = clusterApiUrl(network);

  // Initialize wallets
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ];

  // Use footer styles
  const footerClasses = useFooterStyles();

  return (
    <React.Fragment>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/* Note: Remove or replace this script with next/script for Google Maps integration */}
        {/* <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE" /> */}
        <title>F4cets Marketplace PRO</title>
      </Head>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <ThemeProvider theme={theme}>
              <StyledEngineProvider injectFirst>
                <Component {...pageProps} />
                <Footer
                  theme="white"
                  content={
                    <div>
                      <div className={footerClasses.left}>
                        <a
                          href="https://www.f4cets.market/"
                          target="_blank"
                          className={footerClasses.footerBrand}
                        >
                          F4cet MarketPlace PRO
                        </a>
                      </div>
                      <div className={footerClasses.pullCenter}>
                        <List className={footerClasses.list}>
                          <ListItem className={footerClasses.inlineBlock}>
                            <a
                              href="https://www.f4cets.com/"
                              target="_blank"
                              className={footerClasses.block}
                            >
                              F4cets
                            </a>
                          </ListItem>
                          <ListItem className={footerClasses.inlineBlock}>
                            <a
                              href="https://www.f4cets.com/"
                              target="_blank"
                              className={footerClasses.block}
                            >
                              About us
                            </a>
                          </ListItem>
                          <ListItem className={footerClasses.inlineBlock}>
                            <a
                              href="https://www.f4cets.com/"
                              className={footerClasses.block}
                            >
                              Mint
                            </a>
                          </ListItem>
                          <ListItem className={footerClasses.inlineBlock}>
                            <a
                              href="https://www.f4cets.com/"
                              target="_blank"
                              className={footerClasses.block}
                            >
                              Licenses
                            </a>
                          </ListItem>
                        </List>
                      </div>
                      <div className={footerClasses.rightLinks}>
                        <ul>
                          <li>
                            <Button
                              href="https://x.com/f4cetsofficial"
                              target="_blank"
                              color="twitter"
                              justIcon
                              simple
                            >
                              <i className="fab fa-twitter" />
                            </Button>
                          </li>
                          <li>
                            <Button
                              href="https://x.com/f4cetsofficial"
                              target="_blank"
                              color="dribbble"
                              justIcon
                              simple
                            >
                              <i className="fab fa-dribbble" />
                            </Button>
                          </li>
                          <li>
                            <Button
                              href="https://x.com/f4cetsofficial"
                              target="_blank"
                              color="instagram"
                              justIcon
                              simple
                            >
                              <i className="fab fa-instagram" />
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  }
                />
              </StyledEngineProvider>
            </ThemeProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </React.Fragment>
  );
}

// If you need getInitialProps for class component compatibility, use getServerSideProps or getStaticProps in pages
MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps };
};

export default MyApp;