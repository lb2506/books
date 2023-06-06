import React, { useEffect, useState } from "react";
import axios from 'axios';
import { url } from '../../api';

import "./home.scss"

const Home = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [readingList, setReadingList] = useState([]);
    const [alreadyReadList, setAlreadyReadList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState({
        title: '',
        age: '',
        genre: '',
        author: '',
    });

    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            const response = await axios.get(`${url}/books`)
            setBooks(response.data);
            setFilteredBooks(response.data);
            setIsLoading(false);
        };

        const fetchReadingList = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get(`${url}/userReadList`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReadingList(response.data.readingList);
            } catch (error) {
                console.log(error.response);
            }
        };

        const fetchAlreadyReadList = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get(`${url}/userAlreadyReadList`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAlreadyReadList(response.data.alreadyReadList);
            } catch (error) {
                console.log(error.response);
            }
        };

        fetchAlreadyReadList();
        fetchBooks();
        fetchReadingList();
    }, []);

    const applyFilters = () => {
        const newFilteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(filter.title.toLowerCase()) &&
            (filter.age === '' || (book.ageLower <= Number(filter.age) && Number(filter.age) <= book.ageUpper)) &&
            book.genre.toLowerCase().includes(filter.genre.toLowerCase()) &&
            book.author.toLowerCase().includes(filter.author.toLowerCase())
        );
        setFilteredBooks(newFilteredBooks);
    };

    const resetFilters = () => {
        setFilter({
            title: '',
            age: '',
            genre: '',
            author: '',
        });
        setFilteredBooks(books);
    };

    const addToReadingList = async (bookId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Vous devez être connecté pour ajouter ce livre à votre liste de lecture.');
            return;
        }

        try {
            await axios.post(`${url}/readingList/add`, { bookId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const addedBook = books.find(book => book._id === bookId);
            setReadingList([...readingList, addedBook]);
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
            const addedBook = books.find(book => book._id === bookId);
            setAlreadyReadList([...alreadyReadList, addedBook]);
        } catch (error) {
            console.log(error.response);
        }
    };

    return (
        <div className="home">
            {isLoading ? (
                <p>Chargement des livres...</p>
            ) : (
                <>
                    <div>
                        <h3>Filtrer par :</h3>
                        <input
                            placeholder='Titre...'
                            value={filter.title}
                            onChange={e => setFilter(prev => ({ ...prev, title: e.target.value }))}
                        />
                        <input
                            placeholder='Âge...'
                            value={filter.age}
                            onChange={e => setFilter(prev => ({ ...prev, age: e.target.value }))}
                        />
                        <input
                            placeholder='Genre...'
                            value={filter.genre}
                            onChange={e => setFilter(prev => ({ ...prev, genre: e.target.value }))}
                        />
                        <input
                            placeholder='Auteur...'
                            value={filter.author}
                            onChange={e => setFilter(prev => ({ ...prev, author: e.target.value }))}
                        />
                        <button onClick={applyFilters}>Rechercher</button>
                        <button onClick={resetFilters}>Réinitialiser les filtres</button>
                    </div>
                    <ul>
                        {filteredBooks.map((book) => {
                            const isBookInReadingList = readingList.some(readingBook => readingBook._id.toString() === book._id);
                            const isBookInAlreadyReadList = alreadyReadList.some(alreadyReadBook => alreadyReadBook._id.toString() === book._id);
                            return (
                                <li key={book._id}>
                                    <img src={book.image.secure_url} alt="book"/> / {book.title} / {book.ageLower} - {book.ageUpper} ans / {book.genre} / {book.summary} / {book.author}
                                    {!isBookInReadingList && <button onClick={() => addToReadingList(book._id)}>Like</button>}
                                    {!isBookInAlreadyReadList && <button onClick={() => addToAlreadyReadList(book._id)}>Déjà lu</button>}
                                </li>
                            );
                        })}

                    </ul>
                </>
            )}
        </div>
    )
}


export default Home
