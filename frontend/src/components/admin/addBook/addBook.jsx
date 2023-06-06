import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { url } from '../../../api';


const AddBook = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [summary, setSummary] = useState('')
    const [ageLower, setAgeLower] = useState('');
    const [ageUpper, setAgeUpper] = useState('');
    const [image, setImage] = useState('');
    const [buttonLabel, setButtonLabel] = useState('Ajouter le livre');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token');
        setButtonLabel('En cours ...');

        try {
            await axios.post(
                `${url}/books`,
                { title, ageLower, ageUpper, genre, author, summary, image },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            navigate('/adminPanel');
        } catch (error) {
            console.error(error.response.data);
            setButtonLabel('Ajouter le livre');
        }
    };

    const handleProductImageUpload = (e) => {
        const file = e.target.files[0];

        TransformFileData(file);
    };

    const TransformFileData = (file) => {
        const reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setImage(reader.result);
            };
        } else {
            setImage("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Auteur" required />
            <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre" required />
            <input type="text" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Description" required />
            <input type="number" value={ageLower} onChange={(e) => setAgeLower(e.target.value)} placeholder="Age Min" required />
            <input type="number" value={ageUpper} onChange={(e) => setAgeUpper(e.target.value)} placeholder="Age Max" required />
            <input type="file" id="imgUpload" accept="image/*" onChange={handleProductImageUpload} required />
            <button type="submit">{buttonLabel}</button>
        </form>
    );
};

export default AddBook;
