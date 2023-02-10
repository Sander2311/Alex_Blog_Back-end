import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from '../models/User.js';

export const register = async (req, res) =>{ 
    try{
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10); // algr encryption pass
        const hash = await bcrypt.hash(password, salt); //our hass of pass

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })

        const user = await doc.save();

        const token = jwt.sign({ // after register create token
            _id: user._id,
        },
        'keyToken123', // key of token
         {
            expiresIn: '30d', //life time of the token 
         }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Cannot register',
        });
    };
}

export const login = async (req, res) => {
    try{
        const user = await UserModel.findOne({ email: req.body.email }); //find by id

        if(!user){
            return res.status(401).json({
                message: 'User is not exist',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);//if pass from req = pass from BD of the user
        
        if(!isValidPass){ // pass != pass in BD
            return res.status(401).json({
                message: 'Email or Password is no valid',
            });
        }

        const token = jwt.sign({ // after login create token
            _id: user._id,
        },
        'keyToken123', // key of token
         {
            expiresIn: '30d', //life time of the token 
         }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });

    } catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Cannot login',
        });
    }
};

export const getMe = async (req, res) =>{
    try{
        const user = await UserModel.findById(req.userId);

        if(!user){
            return res.status(404).json({
                message: 'User is not exist',
            });
        };

        const { passwordHash, ...userData } = user._doc;

        res.json(userData);

    } catch(err){
        console.log(err);
        res.status(500).json({
            message: 'You do not have access',
        });
    }
}