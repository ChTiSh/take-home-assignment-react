import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, from} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Login from './components/Login.tsx'
import App from './App.tsx'
import ProductList from './components/ProductList.tsx'
import './index.css'
import { ErrorResponse, onError } from "@apollo/client/link/error";
import { AUTH_TOKEN, REFRESH_TOKEN, EXPIRES_AT} from "./constants.ts";

const httpLink = createHttpLink({
    uri: 'http://localhost:8080/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(AUTH_TOKEN);
  // return the headers to the context so httpLink can read them
  console.log(token)
  const newHeaders = {
    ...headers,
    Authorization: token ? `Bearer ${token}` : "",
  };
  console.log("Headers:", newHeaders);
  return {
    headers: newHeaders,
  };
});

const getNewToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);
  const accessToken = localStorage.getItem(AUTH_TOKEN);

  const response = await fetch('/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accessToken, refreshToken }),
  });

  if (!response.ok) {
    console.log("Refresh token is invalid. Please log in again.");
  }

  const { accessToken: newAccessToken, expiresAt } = await response.json();

  // Update the local storage with the new token and expiration time
  localStorage.setItem(AUTH_TOKEN, newAccessToken);
  localStorage.setItem(EXPIRES_AT, expiresAt);

  return newAccessToken;
};

const errorLink = onError( 
  async ({ graphQLErrors, operation, forward }: ErrorResponse) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        switch (err.extensions.code) {
          // Apollo Server sets code to UNAUTHENTICATED
          // when an AuthenticationError is thrown in a resolver
          case "UNAUTHENTICATED": {
            // Modify the operation context with the new token
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `Bearer ${await getNewToken()}`
              },
            });
            // Retry the request, returning the new observable
            return forward(operation);
          }
        }
      }
    }
    return forward(operation);
  }
);
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([authLink,  httpLink, errorLink]),
  //link: authLink.concat(httpLink),
});

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
      path:'/products',
      element: <ProductList />,
    },
    {
      path:'/login',
      element: <Login />,
    }
  ]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <RouterProvider router={router} />
        </ApolloProvider>
    </React.StrictMode>
)
