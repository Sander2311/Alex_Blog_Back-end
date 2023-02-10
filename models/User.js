import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String, // type of this item 
        required: true, // required row
    },
    email: {
        type: String, 
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String, //no obj if no required
}, {
    timestamps: true, //date of cteate or update
});

export default mongoose.model('User', UserSchema);