import { ProductProps } from "../types/types";

const ProductSingle = ({ product }:ProductProps) => {
    return (
        <div className="card">
            <ul>
                <li>Product Title:{product.title}</li>
                <li>Product Description:{product.description}</li>
                <li>Product Price:{product.price}</li>
            </ul>
        </div>
    )

};
export default ProductSingle;