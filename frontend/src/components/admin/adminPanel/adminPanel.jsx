import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./adminPanel.scss"

const AdminPanel = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // new state


    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            const response = await axios.get('https://books-zpg6.onrender.com/books')
            setBooks(response.data);
            setIsLoading(false);
        };

        fetchBooks();
    }, []);

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');

        await axios.delete(`https://books-zpg6.onrender.com/books/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setBooks(books.filter((book) => book._id !== id));
    };

    return (
        <div className="adminPanel">

            {isLoading ? (
                <p>Chargement des informations...</p>
            ) : (
                <>
                    <button onClick={() => navigate('/adminPanel/addBook')}>Ajouter un livre</button>
                    <ul>
                        {books.map((book) => (
                            <li key={book._id}>
                                {book.title} / {book.ageLower} - {book.ageUpper} / {book.genre} / {book.summary} / {book.author}
                                <button onClick={() => handleDelete(book._id)}>Supprimer</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}

export default AdminPanel;
