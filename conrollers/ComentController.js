import ComentModel from "../models/Coment.js";
import PostModel from "../models/Post.js";

export const getLastComents = async (req, res) => {
    try {
        const coments = await ComentModel.find().sort({ createdAt: -1 }).limit(5).populate('user',  '-passwordHash').exec();

        res.json(coments);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot get coments',
        });
    }
};

export const create = async (req, res) => {
    try {
        const postId = req.params.id;
        const doc = ComentModel({
            text: req.body.text,
            user: req.userId,
        });

        const coment = await doc.save();
        const id = coment._id;

        PostModel.findOneAndUpdate(
            {
                _id: postId, // find param 
            },
            {
                "$push": {coments: id}
            },
            {
                returnDocument: 'after', // return doc after update
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Cannot get post",
                    })
                }

                if (!doc) { // if don`t find post
                    return res.status(404).json({
                        message: 'Post didn`t find',
                    });
                };
            }
        ).populate('user');

        res.json(coment);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot create coment',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.postId; 
        const commentId = req.params.commentId;

        await PostModel.updateOne(
            {
                _id: postId,
                
            },
            { //params for update
                $pull: { 'coments':  commentId} 
            },
        );

        ComentModel.findOneAndDelete({
            _id: commentId,
        }, (err, doc) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    message: 'Cannot delete comment',
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'Comment didn`t find',
                });
            }
        });
        
        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot delete comments',
        });
    }
};

export const update = async (req, res) => {
    try {
        const commentId = req.params.id;
        
        await ComentModel.updateOne(
            {
                _id: commentId,
            },
            { //params for update
                text: req.body.text,
            },
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot update comment',
        });
    }
};