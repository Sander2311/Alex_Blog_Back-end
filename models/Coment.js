import mongoose from 'mongoose';

const ComentSchema = new mongoose.Schema({
    text: {
        type: String, // type of this item 
        required: true, // required row
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, //relation btwn schems
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true, //date of cteate or update
});

export default mongoose.model('Coment', ComentSchema);