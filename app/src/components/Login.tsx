
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import judoLogo from '../../../design/Logo.png'

interface LoginProps {
    email:string; 
    password:string;
}

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [userIsVerified, setUserIsVerified] = useState(false);
    const logInCredentials: LoginProps = {
        email: email,
        password:password
    }
    //still missing the credential verification logic

    const handleSubmit = (): void =>{
        //dispatch the info to the database
        console.log(logInCredentials);
        //if user credentials are verified
        if(userIsVerified){
            //navigate to the productlist page
            navigate("/products")
        }
        
    }
    return (
        <div className="h-screen flex flex-col items-center justify-center w-[466px] mx-auto">
            <div className="flex-col shadow-[0_0_6px_0px_rgba(0,0,0,0.20)] bg-white text-start p-[56px] rounded-[10px]">
                <img src={judoLogo} className="w-[143px] h-[24px]" alt="judoLogo"/>
                
                <h2 className="font-sourcePro font-semibold leading-10 text-black text-[30px] mt-10 mb-8">Sign in</h2>
                <form className="w-full">
                    <label>Email</label>
                    <input type="text" value={email} placeholder='andrea@judo.app'onChange={(e) => setEmail(e.target.value)}></input>
                    <label>Password</label>
                    <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    <button className="px-10 mx-auto hover:bg-lighterPurple rounded-sm w-full bg-purple font-SourcePro font-bold text-sm text-white leading-6 py-2 h-10" onClick={handleSubmit}>Sign in</button>
                    <a href='/'><p className="text-center textlink mt-8">Forgot password?</p></a>
                </form>
            </div>
            <div className="font-sourcePro text-sm text-center text-fontGray leading-6 tracking-normal mt-8">
                <p>&copy;2001-2019 All Rights Reserved. Clip<sup>&reg;</sup> is a registered trademark of Rover labs.</p>
                <p>Cookie Preferences, Privacy, and Terms.</p>
            </div>
        </div>
    )

};

export default Login;
