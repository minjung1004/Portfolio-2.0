const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

// Check Login 
const authMiddleware = (req, res, next ) => {
    const token = req.cookies.token;
  
    if(!token) {
      return res.status(401).json( { message: 'Unauthorized'} );
    }
  
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.userId = decoded.userId;
      next();
    } catch(error) {
      res.status(401).json( { message: 'Unauthorized'} );
    }
}

// GET Admin - Login Page
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Min's new portfolio."
        }
        res.render('admin/login', {locals, layout: adminLayout});
    } catch (error) {
        console.log(error); 
    }
});

// POST Admin - Check Login
router.post('/admin', async (req, res) => {
    try {
        const {username, password} = req.body; 
        const user = await User.findOne({ username });

        if(!user) {
            return res.status(401).json({message: "Invalid credentials"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(401).json({message: "Invalid credentials"});
        }

        const token = jwt.sign({userId: user.id}, jwtSecret);
        res.cookie('token', token, {httpOnly: true});
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error); 
    }
});

// GET Admin - Dashboard Page
router.get('/dashboard', authMiddleware, async (req, res) => {
    try{
        const locals = {
            title: "Dashboard",
        }
        const data = await Post.find();
        res.render('admin/dashboard', {locals, data, layout: adminLayout});
    } catch(error){
        console.log(error);
    }
});

// GET Admin - Create New Post
router.get('/add-post', authMiddleware, async (req, res) => {
    try{
        const locals = {
            title: "Add Post",
        }    
        res.render('admin/add-post', {locals, layout: adminLayout});
    } catch(error){
        console.log(error);
    }
});

// POST Admin - Add New Post
router.post('/add-post', authMiddleware, async (req, res) => {
    try{
        try {
            const newPost = new Post({
                topic: req.body.topic,
                title: req.body.title,
                content: req.body.content,
                startDate: convertMMYYYYToDate(req.body.startDate),
                endDate: convertMMYYYYToDate(req.body.endDate),
                linkTitle: req.body.linkTitle,
                link: req.body.link,
            });
            await Post.create(newPost);
            res.redirect('/dashboard');
        } catch (error) {
            console.log(error);
        }
    } catch(error){
        console.log(error);
    }
});

// GET Admin - Edit Post
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try{
        const locals = {
            title: "Edit Post",
        }
        const data = await Post.findOne({ _id: req.params.id });
        console.log(data);
        res.render('admin/edit-post', {
            data: {
                _id: data._id,
                topic: data.topic,
                title: data.title,
                content: data.content,
                startDate: formatDateToMMYYYY(new Date(data.startDate)),
                endDate: formatDateToMMYYYY(new Date(data.endDate)),
                linkTitle: data.linkTitle,
                link: data.link,
            }, layout: adminLayout, locals
        });
    } catch(error){
        console.log(error);
    }
});

// PUT Admin - Edit Post
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            topic: req.body.topic,
            title: req.body.title,
            content: req.body.content,
            startDate: convertMMYYYYToDate(req.body.startDate),
            endDate: convertMMYYYYToDate(req.body.endDate),
            linkTitle: req.body.linkTitle,
            link: req.body.link
      });
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
      
    }
});

// DELETE Admin - Delete Post
router.delete('/delete-post/:id', authMiddleware, async(req, res) => {
    try {
        await Post.deleteOne( { _id: req.params.id});
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
});

// GET Admin - Logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})

// Functions to format the dates
function convertMMYYYYToDate(mmYYYY) {
    const [month, year] = mmYYYY.split("-");
    return new Date(`${year}-${month}-01`);
}

function formatDateToMMYYYY(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${year}`;
}


// // POST Admin - Register
// router.post('/register', async (req, res) => {
//     try {
//         const {username, password} = req.body; 
//         const hashedPassword = await bcrypt.hash(password, 10);

//         try {
//             const user = await User.create({ username, password: hashedPassword});
//             res.status(201).json({message: 'User Created', user});
//         } catch (error) {
//             if(error.code === 11000) {
//                 res.status(409).json({message: 'User already in use'});
//             }
//             res.status(500).json({message: 'Internal error'})
//         }
      
//     } catch (error) {
//         console.log(error); 
//     }
// });


module.exports = router;