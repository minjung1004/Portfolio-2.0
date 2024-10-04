const express = require('express');
const router = express.Router();
const Post = require('../models/post');

//Routes
// GET HOME
router.get('', async (req, res) => {
    const locals = {
        title: "Min Jung",
        description: "Min's new portfolio."
    }

    try {
        const data = await Post.find();
        res.render('index', {locals, data});
    } catch (error) {
        console.log(error); 
    }
});

// GET LOGIN
router.get('/login', (req, res) => {
    res.render('login');
});

// GET EDIT
router.get('/edit', (req, res) => {
    res.render('edit');
});

module.exports = router;
