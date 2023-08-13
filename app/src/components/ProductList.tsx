import { Product } from "../types/types";
import ProductSingle from "./ProductSingle";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import {AUTH_TOKEN, REFRESH_TOKEN,EXPIRES_AT } from "../constants";
import { useApolloClient } from "@apollo/client";
import { useEffect } from 'react';

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

const ProductList = () => {    
    const navigate = useNavigate();
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
    }, [error, refetch]);
    console.log(localStorage.getItem(AUTH_TOKEN));
    const client = useApolloClient();
    console.log(data);
    console.log('Error fetching products:', error?.message);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;
    
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