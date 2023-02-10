import Jwt from "jsonwebtoken";

export default (req, res, next) =>{   //Midle f()
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, ''); // exist token or not - str anyway. delate word and we have just token
    
    if(token){
        try{
            const decoded = Jwt.verify(token, 'keyToken123') // jwt func for decode token

            req.userId = decoded._id; // get id from token

            next();
        } catch(err){
            return res.status(403).json({
                message: 'You do not have access',
            });
        }
    } else{
        return res.status(403).json({
            message: 'You do not have access',
        });
    };
};