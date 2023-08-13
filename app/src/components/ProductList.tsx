import { Product } from "../types/types";
import ProductSingle from "./ProductSingle";
import { useNavigate } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import {AUTH_TOKEN, REFRESH_TOKEN,EXPIRES_AT } from "../constants";
import { useApolloClient } from "@apollo/client";
import { useEffect, useState } from 'react';

//grabbing the productlist from the dummy data
const GET_PRODUCTS = gql`
    query Query {
        products {
            id
            title
            description
            price
            currency
        }
    }
`;

const GET_NEW_TOKEN = gql`
mutation Mutation($accessToken: String!, $refreshToken: String!) {
  refreshSession(accessToken: $accessToken, refreshToken: $refreshToken) {
    refreshToken
    expiresAt
    accessToken
  }
}
`

const ProductList = () => {    
    const navigate = useNavigate();
    const [expired, setExpired] = useState(false);
    const {loading, error, data, refetch} = useQuery(GET_PRODUCTS,{
        onCompleted: () => {
            console.log('in query')
            console.log(localStorage.getItem(AUTH_TOKEN));
        }
    });
    useEffect(() => {
        if (error) {
          // If an error occurs, refetch the data
          refetch();
        }
    });

    const [getNewToken] = useMutation(GET_NEW_TOKEN,{
        variables:{
          accessToken: localStorage.getItem(AUTH_TOKEN),
          refreshToken: localStorage.getItem(REFRESH_TOKEN)
        },
        onCompleted: ({refreshSession}) => {
          console.log('in getting new token')
          localStorage.setItem(AUTH_TOKEN, refreshSession.accessToken);
          localStorage.setItem(EXPIRES_AT, refreshSession.expiresAt);
          localStorage.setItem(REFRESH_TOKEN, refreshSession.refreshToken);
          console.log(refreshSession.accessToken, refreshSession.expiresAt, refreshSession.refreshToken)
        }
    });
    console.log(localStorage.getItem(AUTH_TOKEN));
    const client = useApolloClient();
    console.log(data);
    console.log('Error fetching products:', error?.message);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    const sessionExpiryTime = localStorage.getItem("sessionExpiryTime");
    if (sessionExpiryTime && Date.now() >= new Date(sessionExpiryTime).getTime()) {
        getNewToken()
    }

    const handleLogOut = (e: { preventDefault: () => void; }): void =>{
        e.preventDefault();
        localStorage.removeItem(AUTH_TOKEN);
        localStorage.removeItem(EXPIRES_AT);
        localStorage.removeItem(REFRESH_TOKEN);
        client.resetStore();
        navigate("/login");
    }
  
    return (
        <div>
            <div className="text-center my-10">
                <button className="btn-secondary m-2" onClick={handleLogOut}>Log Out</button>
            </div>
            <div className="card">
            <div className="card">
                {data.products.map((product: Product) => (
                    <div className="border-solid border-2 rounded-md py-8 px-4 m-2 bg-white border-bgGray">
                        <li key={product.id} className="list-none">
                            <ProductSingle product={product} />
                        </li>
                    </div>
                ))}
            </div>
            </div>
        </div>
    )
};
export default ProductList;