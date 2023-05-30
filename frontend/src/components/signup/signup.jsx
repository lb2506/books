import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const SignUp = () => {

    const navigate = useNavigate();

    const [email, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await axios.post('http://localhost:5000/signup', { email, password });
        localStorage.setItem('token', response.data.token);

        navigate('/');
    };

    return (
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={email} onChange={(e) => setUsername(e.target.value)} placeholder='Email' />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                <button type="submit">S'inscrire</button>
            </form>
        </>
    );
};

export default SignUp