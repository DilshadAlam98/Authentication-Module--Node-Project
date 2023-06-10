import UserPosts from "../models/user_posts.js";

const addPosts = async (req, res) => {
    const body = req.body;

    try {
        const posts = new UserPosts({
            locations: body.locations,
            captions: body.captions,
            tags: body.tags,
            likes: body.likes,
            shares: body.shares,
            comments: body.comments
        });

        await posts.save();
        res.status(200).send({ message: "Post added successfully" });
    } catch (e) {
        res.status(500).send(e);
    }
};

export { addPosts };
