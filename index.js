import express from 'express';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation, comentCreateValidation, updateValidation } from './validations.js';

import checkAuth from './utils/checkAuth.js';
import handleValidationErrors from './utils/handleValidationErrors.js';

import * as UserController from './conrollers/UserController.js';
import * as PostController from './conrollers/PostController.js';
import * as ComentController  from './conrollers/ComentController.js';



mongoose
    .connect('mongodb+srv://admim:sander@cluster0.2urd1z3.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() =>console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({ //storage for uploading images
    destination: (_,__, cb) =>{ // way of file
        cb(null, 'uploads'); // save the files in folder 'uploads'
    },
    filename: (_, file, cb) =>{ 
        cb(null, file.originalname); // save as original file name
    },
}); 

const upload = multer({ storage }); // func for use multer

app.use(express.json()); // read json from req
app.use(cors()); // manage cors error
app.use('/uploads', express.static('uploads')); // when req on "uploads" check folder 'uploads'. Get req for static file

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register); // req - next validation - next callback
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) =>{
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/tags', PostController.getLastTags);
app.get('/coments', ComentController.getLastComents);

app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.get('/popular', PostController.getAllPopular);
app.get('/tags/:name', PostController.getAllByTag);
app.get('/posts-by-user/:id', PostController.getAllByUser);
app.get('/posts', PostController.getAll);

app.post('/comment/:id', checkAuth, comentCreateValidation, handleValidationErrors, ComentController.create);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/comment/:postId/:commentId', checkAuth, ComentController.remove)
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/comment/:id', checkAuth, comentCreateValidation, handleValidationErrors, ComentController.update);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);
app.patch('/user/:id', checkAuth, updateValidation, handleValidationErrors, UserController.update);

app.listen(3333, (err) => {
    if(err){
        return console.log(err);
    }

    console.log('Server started')
});