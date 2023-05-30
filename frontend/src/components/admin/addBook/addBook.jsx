import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AddBook = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [summary, setSummary] = useState('')
    const [ageLower, setAgeLower] = useState('');
    const [ageUpper, setAgeUpper] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token');

        await axios.post(
            'http://localhost:5000/books',
            { title, ageLower, ageUpper, genre, author, summary },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        navigate('/adminPanel');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Auteur" />
            <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre" />
            <input type="text" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Description" />
            <input type="number" value={ageLower} onChange={(e) => setAgeLower(e.target.value)} placeholder="Age Min" />
            <input type="number" value={ageUpper} onChange={(e) => setAgeUpper(e.target.value)} placeholder="Age Max" />
            <button type="submit">Ajouter</button>
        </form>
    );
};

export default AddBook;
