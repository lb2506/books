const express = require('express');
const Book = require('../models/book');
const User = require('../models/user');

const jwt = require('jsonwebtoken');
const router = express.Router();

// Ajouter un livre à la liste de lecture 

router.post('/readingList/add', async (req, res) => {
    try {
        const book = await Book.findById(req.body.bookId);
        if (!book) return res.status(404).send();

        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.CRET_KEY);
        const user = await User.findById(decoded._id);
        if (!user) return res.status(404).send();

        user.readingList.push(book._id);
        await user.save();

        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
});

// Supprimer un livre de la liste de lecture

router.delete(`/readingList/remove/:id`, async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded._id);
        if (!user) return res.status(404).send();

        user.readingList = user.readingList.filter(
            (bookId) => bookId.toString() !== req.params.id
        );
        await user.save();

        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
});

// Ajouter un livre à la liste des livres déjà lus

router.post('/alreadyReadList/add', async (req, res) => {
    try {
        const book = await Book.findById(req.body.bookId);
        if (!book) return res.status(404).send();

        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded._id);
        if (!user) return res.status(404).send();

        user.alreadyReadList.push(book._id);
        await user.save();

        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
});

// Supprimer un livre à la liste des livres déjà lus

router.delete(`/alreadyReadList/remove/:id`, async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded._id);
        if (!user) return res.status(404).send();

        user.alreadyReadList = user.alreadyReadList.filter(
            (bookId) => bookId.toString() !== req.params.id
        );
        await user.save();

        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;
