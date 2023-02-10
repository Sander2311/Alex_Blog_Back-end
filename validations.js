import { body } from 'express-validator'; //validation of req body


export const loginValidation = [
    body('email', 'not valid email').isEmail(),  // check is email or not
    body('password', 'not valid password').isLength({ min: 5}), //Length of pass
];

export const registerValidation = [
    body('email', 'not valid email').isEmail(),  // check is email or not
    body('password', 'not valid password').isLength({ min: 5}), //Length of pass
    body('fullName', 'not valid fullName').isLength({ min: 3}),
    body('avatarUrl', 'not valid avatarUrl').optional().isURL(), // if not - its notmal, but if yes - check is url or not
];

export const postCreateValidation = [
    body('title', 'Title of post').isLength({ min: 3 }).isString(),  
    body('text', 'Text of post').isLength({ min: 5 }).isString(), 
    body('tags', 'Arr of tags').optional().isString(),
    body('imageUrl', 'not valid imageUrl').optional().isString(), 
];

export const comentCreateValidation = [
    body('text', 'Text of coment').isLength({ min: 1, max: 50 }).isString(),  
];

