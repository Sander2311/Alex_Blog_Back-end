import { text } from 'express';
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: {
        type: String, // type of this item 
        required: true, // required row
    },
    text: {
        type: String, 
        required: true,
    },
    tags: {
        type: Array,
        default: [],
    },
    viewsCount:{
        type: Number,
        default: 0, 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, //relation btwn schems
        ref: 'User',
        required: true,
    },
    coments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coment' }],
    imageUrl: String, //no obj if no required
}, {
    timestamps: true, //date of cteate or update
});

export default mongoose.model('Post', PostSchema);