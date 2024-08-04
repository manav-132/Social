const router=require("express").Router();
const Post=require("../models/Postmodel")
const User=require("../models/usermodel")

//create a post

router.post("/",async (req,res)=>{
    const newpost=new Post(req.body)
    try{
           const savepost= await newpost.save(); 
           res.status(200).json(savepost);
    }catch(err){
        res.status(500).json(err);
    }
})
//update a post
router.put("/:id",async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
            await post.updateOne({$set:req.body})
            res.status(200).json("post updated")
        }
        else{
            res.status(403).json("only update your own post")
        }
    }
    catch(err){
        res.status(500).json(err)
    }
})

//delete posts

router.delete("/:id",async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
            await post.deleteOne({$set:req.body})
            res.status(200).json("post deleted")
        }
        else{
            res.status(403).json("only delete your own post")
        }
    }
    catch(err){
        res.status(500).json(err)
    }
})

//like a post and dislike it
router.put("/:id/like",async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json("liked")
        }
        else{
            await post.updateOne({$pull:{likes:req.body.userId}})
            res.status(200).json("disliked")
        }
    }catch(err){
        res.status(500).json(err)

    }
})

//get a post
router.get("/:id",async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
        res.status(500).json(err)
    }
})

//get post timeline
router.get("/timeline/hello/:userId", async (req, res) => {
    try {
      const currentUser = await User.findById(req.params.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      res.json(userPosts.concat(...friendPosts))
    } catch (err) {
      res.status(500).json(err);
    }
  });

//get user post
router.get("/profile/:username", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      const posts = await Post.find({ userId: user._id });
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports=router
