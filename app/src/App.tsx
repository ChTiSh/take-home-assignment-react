import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function App() {
    const [logIn, setLogIn] = useState(false)
    const navigate = useNavigate();
    const openLogin = () => {
        setLogIn(!logIn);
        navigate('/login')
    }
    return (
        <div className='bg-bgGray h-screen flex items-center justify-center'>
            <button className="btn-primary w-1/8 mx-auto" onClick={openLogin}>Login</button>
        </div>
    )
}

export default App
