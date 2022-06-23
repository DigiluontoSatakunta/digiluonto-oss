import Head from "next/head";
import PropTypes from "prop-types";
import {CacheProvider} from "@emotion/react";
import {ThemeProvider, CssBaseline} from "@mui/material";

import {ApolloProvider} from "@apollo/client";
import client from "../utility/apollo-client";

import {LoaderProvider} from "../hooks/loader";

import createEmotionCache from "../utility/createEmotionCache";
import lightTheme from "../../styles/theme/lightTheme";
import "../../styles/globals.css";

const clientSideEmotionCache = createEmotionCache();

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

export default function MyApp(props) {
  const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={lightTheme}>
        <LoaderProvider>
          <ApolloProvider client={client}>
            <Head>
              <meta
                name="viewport"
                content="width=device-width,initial-scale=1,user-scalable=0"
              />
            </Head>
            <CssBaseline />
            <Component {...pageProps} />
          </ApolloProvider>
        </LoaderProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
