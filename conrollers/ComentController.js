import ComentModel from "../models/Coment.js";
import PostModel from "../models/Post.js";

export const getLastComents = async (req, res) => {
    try {
        const coments = await ComentModel.find().sort({ createdAt: -1 }).limit(5).populate('user').exec();

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


// export const create = async (req, res) => {
//     try {
//         const doc = ComentModel({
//             text: req.body.text,
//             user: req.userId,
//             post: req.body.postId,
//         });

//         const coment = await doc.save();

//         res.json(coment);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             message: 'Cannot create coment',
//         });
//     }
// };