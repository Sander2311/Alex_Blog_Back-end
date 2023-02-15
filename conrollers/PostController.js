import PostModel from "../models/Post.js";


export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().sort({ viewsCount: -1 }).limit(5).exec();// +get tags info

        const tags = posts.map(obj => obj.tags).flat().slice(0, 5);

        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot get posts',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().sort({ createdAt: -1 }).populate('user',  '-passwordHash').exec();// +get user info

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot get posts',
        });
    }
};

export const getAllPopular = async (req, res) => {
    try {
        const posts = await PostModel.find().sort({ viewsCount: -1 }).populate('user',  '-passwordHash').exec();// +get user info

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot gettt posts',
        });
    }
};

export const getAllByTag = async (req, res) => {
    try {
        const tag = req.params.name;
        const posts = await PostModel.find({ tags: { $in: [tag] } }).sort({ viewsCount: -1 }).populate('user',  '-passwordHash').exec();// +get user info

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot get posts',
        });
    }
};

export const getAllByUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const posts = await PostModel.find({ user:  userId}).sort({ createdAt: -1 }).populate('user',  '-passwordHash').exec();// +get user info

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot get posts',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            {
                _id: postId, // find param 
            },
            {
                $inc: { viewsCount: 1 }, //update param, increment +1
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
                res.json(doc);
            }
        ).populate('user').populate('coments').populate({
            path: 'coments',
            populate: {
                path: 'user',
                select: '-passwordHash'
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot get posts',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete({
            _id: postId,
        }, (err, doc) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    message: 'Cannot delete posts',
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'Post didn`t find',
                });
            }

            res.json({
                success: true,
            })
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot get posts',
        });
    }
};

export const create = async (req, res) => {
    try {
        const tags = req.body.tags.split(',').map(tag => tag.trim());
        const doc = PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot create post',
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        const tags = req.body.tags.split(',').map(tag => tag.trim());
        await PostModel.updateOne(
            {
                _id: postId,
            },
            { //params for update
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: tags,
            },
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot update post',
        });
    }
};