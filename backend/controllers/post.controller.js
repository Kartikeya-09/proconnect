import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';
// import Profile from '../models/profile.model';
import User from '../models/user.model.js';



// export const activeCheck = async(req, res) => {
//   // Your logic here
//   return res.status(200).json({ message: 'Active check successful' });
// }

export const createPost = async (req, res) => {
  try {
    const { token} = req.body;
    const user =  await User.findOne({token:token});
    if(!user){
      return res.status(404).json({message: "user not found"});
    }
    const post  = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    })

    await post.save();
    return res.status(200).json({message: "Post created successfully"});
  }catch(error){
    return res.status(500).json({message: error.message});
  }
}


export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('userId', 'name username profilePicture').sort({ createdAt: -1 });
    return res.status(200).json({message: "Posts fetched successfully", posts});
  } catch (error) {
    return res.status(500).json({message: error.message});
  }     
};

export const deletePost = async (req, res) => {
  try {
    const { token , postId} = req.body;
    const user =  await User
    .findOne({token:token})
    .select('_id');

    if(!user){
      return res.status(404).json({message: "user not found"});
    }
      
      const post = await Post.findOne({_id: postId});

      //Every checks is important for security..

      if(!post){
        return res.status(404).json({message: "Post not found"});
      }
      if(post.userId.toString() !== user._id.toString()){
        return res.status(403).json({message: "You are not authorized to delete this post"});
      }
      await Post.deleteOne({_id: postId});
      return res.status(200).json({message: "Post deleted successfully"});
  } catch (error) {
    return res.status(500).json({message: error.message});
  }     
};

export const commentOnPost = async (req, res) => {
  try {
    const { token , postId, commentBody} = req.body;
 
    const user =  await User
    .findOne({token:token})
    .select("_id");
  
    if(!user){
      return res.status(404).json({message: "user not found"});
    }
        
        const post = await Post.findOne({_id: postId});
       
        if(!post){
          return res.status(404).json({message: "Post not found"});
        } 
        const comment = new Comment ({
          userId: user._id,
          postId: post._id,
          body: commentBody
        });
        
        await comment.save();
       

        return res.status(200).json({message:"Comment on post successfully"})

      }catch(err){
        
        return res.status(500).json({message: err.message});  
      }
    };

export const getCommentsByPost = async (req, res) => {
  // Accept postId from either body (POST) or query (GET)
  const postId = req.body?.postId || req.query?.postId;
  try {
    if (!postId) {
      return res.status(400).json({ message: 'postId is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const comments =  await Comment
    .find({ postId: postId })
    .populate('userId', 'name username profilePicture');
    
    return res.status(200).json({ message: 'Comments fetched successfully', comments: comments.reverse() });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error?.message || error });
  }
};

export const deleteCommentPost  = async (req,res) =>{

    const {postId,commentID, token} =  req.body;  
    try{
        const user =  await User
        .findOne({ token: token })
        .select('_id');
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        const comment = await Comment.findById(commentID);
        if(!comment){
            return res.status(404).json({ message: 'Comment not found' });
        }
        if(String(comment.userId) !== String(user._id)){
            return res.status(403).json({ message: 'Unauthorized to delete this comment' });
        }
        await Comment.deleteOne({_id: commentID});
        return res.status(200).json({ message: 'Comment deleted successfully' });
    }catch(error){
        res.status(500).json({ message: 'Error deleting comment', error: error?.message || error });
    }   
};

export const likePost = async (req, res) => {
  const { postId } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ensure likes is numeric and increment safely
    post.likes = (typeof post.likes === 'number' ? post.likes : 0) + 1;
    await post.save();

    return res.status(200).json({ message: 'Post liked successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error: error?.message || error });
  }
};
