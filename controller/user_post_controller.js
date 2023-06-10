import UserPosts from "../models/user_posts.js";

const addPosts = async (req, res) => {
    const body = req.body;

    console.log("BODY---")
    console.log(body);

    try {
        const posts = new UserPosts({
            location: body.location,
            caption: body.caption,
            tags: body.tags,
            likes: body.likes,
            shares: body.shares,
            comments: body.comments
        });

        console.log("Posts");
        console.log(posts);
        await posts.save();
        res.status(200).send({ message: "Post added successfully" });
    } catch (e) {
        res.status(500).send(e);
    }
};

export { addPosts };
