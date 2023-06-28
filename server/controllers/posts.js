import Post from "../models/Post.js";

// Create
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await UserActivation.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })
        await newPost.save();

        const post = await Post.find();
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json ({ message: err.message })
    }
}

// Read
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json ({ message: err.message })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json ({ message: err.message })
    }
}

// Update
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id); // grabbing the post information
        const isLiked = post.likes.get(userId); // whether the used has liked or not

        if (isLiked) {
            post.likes.delete(userId); // if its liked, delete the user
        } else {
            post.likes.set(userId, true); // if not existent, we're gonna set  the user
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json ({ message: err.message })
    }
}