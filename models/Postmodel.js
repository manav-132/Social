const mongoose=require("mongoose")
const Postmodel=new mongoose.Schema({

  userId:{
    type:String,
    required:true
  },
  desc:{
    type:String,
    max:500
  },
  img:{
    type:String,

  },
  likes:{
    type:Array,
    default:[]
  }
},
{timestamps:true}
);


module.exports=mongoose.model("Post",Postmodel)