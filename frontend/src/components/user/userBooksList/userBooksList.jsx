import React, { useEffect, useState } from "react";
import axios from 'axios';
import { url } from '../../../api';

const UserBooksList = () => {
    const [readingList, setReadingList] = useState([]);
    const [alreadyReadList, setAlreadyReadList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchReadingList = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Vous devez être connecté pour voir votre liste de lecture.');
                return;
            }

            try {
                setIsLoading(true);
                const response = await axios.get(`${url}/userReadList`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReadingList(response.data.readingList);
                setIsLoading(false);
            } catch (error) {
                console.log(error.response);
            }
        };

        const fetchAlreadyReadList = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Vous devez être connecté pour voir votre liste de livres déjà lus.');
                return;
            }

            try {
                setIsLoading(true);
                const response = await axios.get(`${url}/userAlreadyReadList`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAlreadyReadList(response.data.alreadyReadList);
                setIsLoading(false);
            } catch (error) {
                console.log(error.response);
            }
        };

        fetchAlreadyReadList();
        fetchReadingList();
    }, []);

    const removeFromReadingList = async (bookId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Vous devez être connecté pour supprimer ce livre de votre liste de lecture.');
            return;
        }

        try {
            await axios.delete(`${url}/readingList/remove/${bookId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReadingList(readingList.filter(book => book._id !== bookId));
        } catch (error) {
            console.log(error.response);
        }
    };

    const addToAlreadyReadList = async (bookId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Vous devez être connecté pour ajouter ce livre à votre liste de livres déjà lus.');
            return;
        }

        try {
            await axios.post(`${url}/alreadyReadList/add`, { bookId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const addedBook = readingList.find(book => book._id === bookId);
            setAlreadyReadList([...alreadyReadList, addedBook]);
        } catch (error) {
            console.log(error.response);
        }
    };


    const removeFromAlreadyReadList = async (bookId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Vous devez être connecté pour supprimer ce livre de votre liste de livres déjà lus.');
            return;
        }

        try {
            await axios.delete(`${url}/alreadyReadList/remove/${bookId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAlreadyReadList(alreadyReadList.filter(book => book._id !== bookId));
        } catch (error) {
            console.log(error.response);
        }
    };

    return (
        <div className="userBooksList">
            {isLoading ? (
                <p>Chargement des livres...</p>
            ) : (
                <>
                    <h1>Mes livres ...</h1>
                    <h4>À lire</h4>
                    <ul>
                        {readingList.map((book) => {
                            const isBookInAlreadyReadList = alreadyReadList.some(alreadyReadBook => alreadyReadBook._id.toString() === book._id);
                            return (
                                <li key={book._id}>
                                    <img src={book.image.url} alt="book"/> / {book.title} / {book.ageLower} - {book.ageUpper} / {book.genre} / {book.summary} / {book.author}
                                    <button onClick={() => removeFromReadingList(book._id)}>Supprimer</button>
                                    {!isBookInAlreadyReadList && <button onClick={() => addToAlreadyReadList(book._id)}>Déjà lu</button>}
                                </li>
                            );
                        })}
                    </ul>
                    <h4>Déjà lus</h4>
                    <ul>
                        {alreadyReadList.map((book) => (
                            <li key={book._id}>
                                <img src={book.image.url} alt="book"/> / {book.title} / {book.ageLower} - {book.ageUpper} / {book.genre} / {book.summary} / {book.author}
                                <button onClick={() => removeFromAlreadyReadList(book._id)}>Supprimer</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}

export default UserBooksList;
