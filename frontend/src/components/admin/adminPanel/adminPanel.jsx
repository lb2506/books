import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { url } from '../../../api';
import "./adminPanel.scss"

const AdminPanel = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deletingBookId, setDeletingBookId] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            const response = await axios.get(`${url}/books`)
            setBooks(response.data);
            setIsLoading(false);
        };
        fetchBooks();
    }, []);

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        setDeletingBookId(id);

        await axios.delete(`${url}/books/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setBooks(books.filter((book) => book._id !== id));
        setDeletingBookId(null);

    };

    return (
        <div className="adminPanel">

            {isLoading ? (
                <p>Chargement des informations...</p>
            ) : (
                <>
                    <button onClick={() => navigate('/adminPanel/addBook')}>Ajouter un livre</button>
                    <ul>
                        {books && books?.map((book) => (
                            <li key={book._id}>
                                <img src={book.image.secure_url} alt="book" /> / {book.title} / {book.ageLower} - {book.ageUpper} ans / {book.genre} / {book.summary} / {book.author}
                                <button onClick={() => handleDelete(book._id)}>
                                    {deletingBookId === book._id ? 'En cours...' : 'Supprimer'}
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}

export default AdminPanel;
