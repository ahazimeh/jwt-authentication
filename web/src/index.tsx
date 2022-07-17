import React from "react";
import ReactDOM from "react-dom/client";
// import ApolloClient from "apollo-boost";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
// import { ApolloProvider } from "@apollo/react-hooks";

import { TokenRefreshLink } from "apollo-link-token-refresh";

import { from } from "@apollo/client";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

import { createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getAccessToken, setAccessToken } from "./accessToken";

import jwtDecode from "jwt-decode";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const accessToken = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
});

const tokenRefreshLink = new TokenRefreshLink({
  accessTokenField: "accessToken",
  isTokenValidOrUndefined: () => {
    const token = getAccessToken();
    if (!token) {
      return true;
    }

    try {
      const { exp }: any = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      return false;
    }
  },
  fetchAccessToken: () => {
    // console.log("yy");
    return fetch("http://localhost:4000/refresh_token", {
      method: "Post",
      credentials: "include",
    });
  },
  handleFetch: (accessToken) => {
    console.log("xx", accessToken);
    setAccessToken(accessToken);
  },
  // handleResponse: (operation, accessTokenField) => (response: any) => {
  //   console.log("zz", accessTokenField, operation, response);
  //   // here you can parse response, handle errors, prepare returned token to
  //   // further operations
  //   // returned object should be like this:
  //   // {
  //   //    access_token: 'token string here'
  //   // }
  // },
  // handleError: (err) => {
  //   // full control over handling token fetch Error
  //   console.warn("Your refresh token is invalid. Try to relogin");
  //   console.error(err);

  //   // your custom action here
  //   // user.logout();
  // },
});

const additiveLink = from([
  tokenRefreshLink,
  authLink.concat(httpLink),
  // new RetryLink(),
  // new MyAuthLink(),
  // new HttpLink({ uri: 'http://localhost:4000/graphql' })
]);

const client = new ApolloClient({
  link: additiveLink,
  cache: new InMemoryCache(),
  credentials: "include",
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
