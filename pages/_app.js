/**
=========================================================
* F4cets Marketplace - NextJS Material Kit PRO v1.3.1
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-kit-pro
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Coded by Creative Tim and F4cets Team
=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from "react";
import Head from "next/head";
import Script from "next/script";
import { ThemeProvider, createTheme, StyledEngineProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";

// Solana Wallet Imports
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

// User Context
import { UserContextProvider } from "/contexts/UserContext";

// Styles and Components
import "/styles/scss/nextjs-material-kit-pro.scss";
import "/styles/css/react-demo.css";
import "animate.css/animate.min.css";
import Footer from "/components/Footer/Footer.js";
import presentationStyle from "/styles/jss/nextjs-material-kit-pro/pages/presentationStyle.js";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "/components/CustomButtons/Button.js";

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

const useFooterStyles = makeStyles(presentationStyle);

function MyApp({ Component, pageProps }) {
  const router = useRouter();

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

    // Google Analytics page view tracking
    const handleRouteChange = (url) => {
      if (window.gtag) {
        window.gtag("config", process.env.NEXT_PUBLIC_MEASUREMENT_ID, {
          page_path: url,
        });
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = clusterApiUrl(network);
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ];

  const footerClasses = useFooterStyles();

  return (
    <React.Fragment>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>F4cets Marketplace PRO</title>
      </Head>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <UserContextProvider>
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
                                href="https://www.f4cets.com/mission/"
                                target="_blank"
                                className={footerClasses.block}
                              >
                                About us
                              </a>
                            </ListItem>
                            <ListItem className={footerClasses.inlineBlock}>
                              <a
                                href="https://www.f4cets.com/mint/"
                                className={footerClasses.block}
                              >
                                Mint
                              </a>
                            </ListItem>
                            <ListItem className={footerClasses.inlineBlock}>
                              <a
                                href="https://www.f4cets.com/contact/"
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
                                color="x"
                                justIcon
                                simple
                              >
                                <i className="fab fa-x-twitter" />
                              </Button>
                            </li>
                            <li>
                              <Button
                                href="https://discord.gg/TdFGbcTt2C"
                                target="_blank"
                                color="discord"
                                justIcon
                                simple
                              >
                                <i className="fab fa-discord" />
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    }
                  />
                  <Script
                    strategy="lazyOnload"
                    dangerouslySetInnerHTML={{
                      __html: `
                        var vglnk = {key: '470d208414494e10832300d5b64a9924'};
                        (function(d, t) {
                          var s = d.createElement(t);
                          s.type = 'text/javascript';
                          s.async = true;
                          s.src = '//cdn.viglink.com/api/vglnk.js';
                          var r = d.getElementsByTagName(t)[0];
                          r.parentNode.insertBefore(s, r);
                        }(document, 'script'));
                      `,
                    }}
                  />
                </StyledEngineProvider>
              </ThemeProvider>
            </UserContextProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </React.Fragment>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  return { pageProps };
};

export default MyApp;