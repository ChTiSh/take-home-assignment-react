import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, from} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Login from './components/Login.tsx'
import App from './App.tsx'
import ProductList from './components/ProductList.tsx'
import './index.css'
import { onError } from "@apollo/client/link/error";
import { AUTH_TOKEN } from "./constants.ts";

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

const errorLink = onError(
  ({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        switch (err.extensions.code) {
          // Apollo Server sets code to UNAUTHENTICATED
          // when an AuthenticationError is thrown in a resolver
          case "UNAUTHENTICATED":{
            // Modify the operation context with a new token
            const oldHeaders = operation.getContext().headers;
            const accessToken = localStorage.getItem(AUTH_TOKEN);
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: accessToken ? `Bearer ${accessToken}` : "", 
              },
            });
            // Retry the request, returning the new observable
            return forward(operation);
          }
        }
      }
    }
  }
);
const client = new ApolloClient({
  cache: new InMemoryCache(),
  //link: from([httpLink, authLink, errorLink]),
  link: authLink.concat(httpLink),
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
