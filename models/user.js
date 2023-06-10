import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
    },
    username: {
        type: String,
        require: true,
        unique: true,

    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    profilePic: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    },
    friendRequest: [
        {
            friendUser: {
                type: String,
                require: true,
                default: ""
            },
            isApproved: { type: Boolean, default: false, }
        }
    ],
    friends: [
        {
            friendUser: {
                type: String,
                require: true,
                default: ""
            }
        }
    ],
    description: {
        type: String,
        default: ""
    }
}, {
    timestamp: true
})

const User = mongoose.model('User', userSchema);
export default User;