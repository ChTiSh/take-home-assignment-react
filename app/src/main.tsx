import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Login from './components/Login.tsx'
import App from './App.tsx'
import { AUTH_TOKEN } from "./constants.ts";
import ProductList from './components/ProductList.tsx'
import './index.css'

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

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
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
