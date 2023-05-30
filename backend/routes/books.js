const Book = require('../models/book');
const express = require('express');
const adminAuth = require('../middleware/auth');
const router = express.Router();

// Récupérer tous les livres

router.get('/books', async (req, res) => {
    try {
        const books = await Book.find({});
        res.send(books);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Récupérer des livres par tranches d'âge

router.get('/books/:ageRange', async (req, res) => {
    try {
        const books = await Book.find({ ageRange: req.params.ageRange });
        res.send(books);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Ajouter un livre

router.post('/books', adminAuth ,async (req, res) => {
    const book = new Book(req.body);
    try {
        await book.save();
        res.status(201).send(book);
        console.log("Livre ajouté avec succès !");
    } catch (error) {
        res.status(400).send(error);
    }
});

// Supprimer un livre

router.delete('/books/:id', adminAuth ,async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).send();
        }
        res.send(book);
        console.log("Livre supprimé avec succès !")
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router;