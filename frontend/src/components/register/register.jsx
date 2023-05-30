import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Register = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);




    const handleSubmit = async (event) => {
        event.preventDefault();
try{
        const response = await axios.post('https://books-zpg6.onrender.com/register', { email, password });
        localStorage.setItem('token', response.data.token);

        navigate('/');
} catch (error){

    if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
        setEmail('');
        setPassword('');
    } else {
        setErrorMessage('Une erreur est survenue lors de la connexion');
    }
}
    };

    return (
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' required/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' required/>
                <button type="submit">S'inscrire</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </>
    );
};

export default Register