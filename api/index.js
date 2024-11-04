const express = require("express"); //installs express
const cors = require("cors"); // adds cors to the project
const mongoose = require("mongoose"); // adds mongoose to the project
const User = require('./models/user.js'); 
const bcrypt = require('bcrypt'); // adds bcrypt to the project
const jwt = require('jsonwebtoken'); // adding json web tokens to the project
const salt = bcrypt.genSaltSync(10); // adding an encryptio to the password
const cookieParser = require('cookie-parser'); // adding cookie-parser to the project.
const multer = require('multer');// package for adding images into the /uploads folder.
const uploadMiddleware = multer({dest: 'uploads/'})
const fs = require('fs');
const Post = require("./models/post.js");

const app = express();
// using a secret key for sending and receiving data using JWTs
const secret = 'nsvavb;obrovobqobbvbvwbwnogwrbgonovbmbeppbnnbeorbnnpwehnwqbonwpnvnpwephoernbuegbenwfjpwjfoonsldmvvepbhp';

app.use(cors({credentials:true, origin:'http://localhost:3002'}));

app.use(cookieParser());

app.use('/uploads', express.static(__dirname + '/uploads'));
app.get('', (req,res) => {
    res.json('test ok');
});

app.use(express.json());

mongoose.connect('mongodb+srv://dhatrigeethu:ErlVIlx0HvSElD0z@cluster0.f2lkl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

// Creating a new user using username, email and password and sending them to the database with bcrypt encyption using salt.
app.post('/register', async (req,res) => {
    const {username, email, password} = req.body;
    try{
    const userDoc = await User.create({username, email, 
        password:bcrypt.hashSync(password,salt),});
    res.json(userDoc);
}catch(e) {
    //console.log(e);
    res.status(400).json(e);
  }
});

// Logging in user, sending username and password as encrypted to improve authentication and security 

app.post('/login', async (req,res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    const passOK = bcrypt.compareSync(password, userDoc.password);
    if (passOK){
        //logged in
        jwt.sign({username,id:userDoc._id}, secret, {}, (err, token) =>{
            if (err) throw err;
            res.cookie('token',token).json({id:userDoc._id, username,});
        });
    } else{
        res.status(400).json('wrong credentials');
    }

});

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {},(err,info) => {
        if (err) throw err;
        //console.log(info);
        res.json(info);
    });
});

app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
    //res.json({files:req.file});
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const NewPath = path+'.'+ext;
    fs.renameSync(path, NewPath);
    //res.json({ext});

    const {token} = req.cookies;

    jwt.verify(token, secret, {},async (err,info) => {
        if (err) throw err;
        const {title,summary,content} = req.body;
        const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: NewPath,
        author: info.id,
    }); 
    res.json(postDoc);
        //console.log(info);
        //res.json(info);
    
    });
});

app.put('/post', uploadMiddleware.single('file'), async (req,res) => {
    let NewPath = null;
    if (req.file){
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const NewPath = path+'.'+ext;
        fs.renameSync(path, NewPath);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
        if (err) throw err;
        const{id,title,summary,content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('you are not the author');
        }
        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: NewPath ? NewPath : postDoc.cover,
        });

        res.json(postDoc);
    });
});

app.get('/post', async (req,res) => {
    res.json(await Post.find()
    .populate('author', ['username'])
    .sort({createdAt: -1})
    .limit(20));
});

app.get('/post/:id',  async (req,res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author',['username']);
    res.json(postDoc);
});

app.post('/logout',(req,res) => {
    res.cookie('token', '').json('ok');
});

// Getting Post Details for the Post page




app.listen(4000);

