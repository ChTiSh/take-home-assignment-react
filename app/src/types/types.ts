export type Product = {
    id: number;
    title: string;
    description: string;
    price: number;
    currency: string;
}
export type ProductProps = {
    product: Product; 
}

export type ProductListProps = {
    products: Product[]; 
}

export type SignInCredentials = {
    email: string;
    password: string;
}