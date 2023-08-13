import { useState } from "react";
import { useNavigate } from "react-router-dom";
import judoLogo from '../assets/Logo@3x.png';
import { gql, useMutation } from "@apollo/client";
import {AUTH_TOKEN, REFRESH_TOKEN,EXPIRES_AT } from "../constants";
import { useApolloClient } from "@apollo/client";

const GET_TOKEN = gql`
    mutation Mutation(
        $email: String!, 
        $password: String!
    ) {
        authenticate(email: $email, password: $password) {
            accessToken
            expiresAt
            refreshToken
        }
    }
`;

//grab the user and verify if it's in teh database
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const client = useApolloClient();
    const [userIsVerified, setUserIsVerified] = useState(false);
    const [login, { error }] = useMutation(GET_TOKEN,{
        variables:{
            email: email,
            password: password
        },
        onCompleted: ({authenticate}) => {
            console.log('in mutation')
            localStorage.setItem(AUTH_TOKEN, authenticate.accessToken);
            localStorage.setItem(EXPIRES_AT, authenticate.expiresAt);
            localStorage.setItem(REFRESH_TOKEN, authenticate.refreshToken);
            console.log(authenticate.accessToken, authenticate.expiresAt, authenticate.refreshToken)
            setUserIsVerified(true);
        },
        context: {
            headers: {
                Authorization: localStorage.getItem(AUTH_TOKEN),
            }
        }
    });

    if (error) return <p>Error</p>;
    // const signInCredentials: SignInCredentials = {
    //     "email": "bob@example.com",
    //     "password": "password",
    // }

    const handleSubmit = (e: { preventDefault: () => void; }): void =>{
        e.preventDefault();
        login();
        if(localStorage.getItem(AUTH_TOKEN)){
            navigate("/products");
        }
    }
    return (
        <div className="h-screen flex flex-col items-center justify-center w-[466px] mx-auto">
            <div className="flex-col shadow-[0_0_6px_0px_rgba(0,0,0,0.20)] bg-white text-start p-[56px] rounded-[10px]">
                <img src={judoLogo} className="w-[143px]" alt="judoLogo"/>
                
                <h2 className="font-sourcePro font-semibold leading-10 text-black text-[30px] mt-10 mb-8">Sign in</h2>
                <form className="w-full">
                    <label>Email</label>
                    <input type="text" value={email} placeholder='andrea@judo.app'onChange={(e) => setEmail(e.target.value)}></input>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    <button className="px-10 mx-auto hover:bg-lighterPurple rounded-sm w-full bg-purple font-SourcePro font-bold text-sm text-white leading-6 py-2 h-10" onClick={handleSubmit}>Sign in</button>
                    <a href='/'><p className="text-center textlink mt-8">Forgot password?</p></a>
                </form>
            </div>
            <div className="whitespace-nowrap font-sourcePro text-sm text-center text-fontGray leading-6 tracking-normal mt-8 px-0">
                <p>&copy;2001-2019 All Rights Reserved. Clip<sup>&reg;</sup> is a registered trademark of Rover labs.</p>
                <p>Cookie Preferences, Privacy, and Terms.</p>
            </div>
        </div>
    )

};

export default Login;
