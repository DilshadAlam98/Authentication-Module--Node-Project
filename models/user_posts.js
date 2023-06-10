import mongoose from "mongoose";
import magoose from "mongoose";



const taagedSchema = mongoose.Schema({
    tagged: {
        name: {
            type: String,
            required: true,
        },
        total_tags: {
            type: Number,
        }
    },

})

const sharedSchema = mongoose.Schema({
    shared: {
        name: {
            type: String,
            required: true,

        },
        total_shared: {
            type: Number
        }
    },

})

const likedSchema = mongoose.Schema({
    liked: {
        name: {
            type: String,
            required: true,

        },
        total_liked: {
            type: Number,
        }
    }

})

const commentSchema = mongoose.Schema({
    data: {
        type: String,
        required: true,
    },
    total_comments: {
        type: Number,
    }
})



const userPostSchema = magoose.Schema({
    location: {
        type: String,
        unique: true,
    },
    caption: {
        type: String,
        unique: true,
    },
    tags: [taagedSchema],
    shares: [sharedSchema],
    likes: [likedSchema],
    comments: [commentSchema]
})


const USERPOST = mongoose.model("user-post", userPostSchema);

export default USERPOST;