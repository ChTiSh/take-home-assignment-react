import { Product } from "../types/types";
import ProductSingle from "./ProductSingle";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

//grabbing the productlist from the dummy data
const GET_PRODUCTS = gql`
    query GetProducts {
        products {
            title
            description
            price
        }
    }
`;

/*
localStorage.setItem(AUTH_TOKEN, authenticate.accessToken);
localStorage.setItem(EXPIRES_AT, authenticate.expiresAt);
localStorage.setItem(REFRESH_TOKEN, authenticate.refreshToken);
*/

const ProductList = () => {    
    const {error, data } = useQuery(GET_PRODUCTS);
    if (error) return <p>Error</p>;
  
    return (
        <div>
            <div className="card">
                <button className="btn-secondary">Log Out</button>
            </div>
            <div className="card">
                {data.map(function(product:Product){
                    <ProductSingle product={product}/>
                })}
            </div>
        </div>
    )
};
export default ProductList;