import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { v4 as uuidv4 } from "uuid";

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
} from "@apollo/client";
import { uniqBy } from "lodash";
import { onError } from "@apollo/client/link/error";

import "./i18n";

import "./index.css";

import { App } from "./components/app/App";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const cookie = cookies.get("ga");
// dynamically loading logging and tracing modules (skipped in development mode)
if (process.env.NODE_ENV !== "development") {
  import(/* webpackChunkName: "appSentry" */ "@sentry/react").then(Sentry => {
    import(/* webpackChunkName: "appSentry" */ "@sentry/tracing").then(
      tracing => {
        Sentry.init({
          dsn: `${process.env.REACT_APP_SENTRY_DSN}`,
          release: "digiluonto@" + process.env.npm_package_version,
          integrations: [new tracing.Integrations.BrowserTracing()],
          tracesSampleRate: 1.0,
        });
      }
    );
  });
  if (cookie === "enabled" && process.env.REACT_APP_SERVER.startsWith("production")) {
    import(/* webpackChunkName: "tagManager" */ "react-gtm-module").then(
      TagManager => {
        const tagManagerArgs = {
          gtmId: `${process.env.REACT_APP_GTM}`,
          anonymizeIp: true,
        };
        TagManager.initialize(tagManagerArgs);
      }
    );
  }
}

const abortController = new AbortController();

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_API,
  fetchOptions: {
    signal: abortController.signal,
  },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    const query = window.location.search; // ?oid=12345
    window.location.href = `/error.html${query}`;
  }
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          placesByLocation: {
            keyArgs: ["groupId", "locale"],
            merge(existing = [], incoming) {
              return uniqBy([...existing, ...incoming], "__ref");
            },
          },
          journeysByLocation: {
            keyArgs: ["groupId", "locale"],
            merge(existing = [], incoming) {
              return uniqBy([...existing, ...incoming], "__ref");
            },
          },
          placesOnMap: {
            keyArgs: ["groupId", "locale"],
            merge(existing = [], incoming) {
              return uniqBy([...existing, ...incoming], "__ref");
            },
          },
        },
      },
    },
  }),
});

const getUid = () => {
  return new Promise(function (resolve, reject) {
    const uid = localStorage.getItem("uid") || uuidv4();
    localStorage.setItem("uid", uid);
    resolve(uid);
  });
};

const getOid = () => {
  return new Promise(function (resolve, reject) {
    const urlParams = new URLSearchParams(window.location.search);

    // 1st url params else localStorage and fallback Digiluonto
    const oid =
      urlParams.get("oid") ||
      localStorage.getItem("oid") ||
      `${process.env.REACT_APP_DEFAULT_GROUP}`;

    // asetetaan oid localstrageen app.js:ssa
    // kun on todettu että oid on jokin oikea

    resolve(oid);
  });
};

const initReact = function (oid, uid) {
  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App orgId={oid} userId={uid} />
      </ApolloProvider>
    </React.StrictMode>,
    document.getElementById("root")
  );
};

const init = async () => {
  const oid = await getOid();
  const uid = await getUid();
  initReact(oid, uid);
};

init();

if (process.env.NODE_ENV === "development") reportWebVitals(console.log);
if (process.env.NODE_ENV === "production")
  serviceWorkerRegistration.unregister();
