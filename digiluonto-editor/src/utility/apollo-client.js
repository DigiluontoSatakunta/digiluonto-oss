import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";
import {createUploadLink} from "apollo-upload-client";
import {setContext} from "@apollo/client/link/context";

import {GRAPHQL_API} from "./definitions";

const uri = `${GRAPHQL_API}/graphql`;

const httpLink = createHttpLink({uri});

const uploadLink = createUploadLink({uri});

const authLink = setContext((_, {headers}) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(uploadLink),
  uri,
  cache: new InMemoryCache(),
});

export default client;
