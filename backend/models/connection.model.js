import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,   
        ref: 'User', // Reference to User model
    },
    connectionId:{
        type: mongoose.Schema.Types.ObjectId,   
        ref: 'User', // Reference to User model
        
    },
    staus_accepted:{
        type: Boolean,
        default: null,
    }
});

const Connection = mongoose.model('Connection', connectionSchema);

export default Connection;
