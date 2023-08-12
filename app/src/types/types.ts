export type Product = {
    title: string;
    description: string;
    price: number;
    
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