const mongoose=require("mongoose");
const commentSchema=new mongoose.Schema({
    bookId:{type:mongoose.Schema.Types.ObjectId,ref:"Book",required:true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    },{ timestamps: true });

module.exports=mongoose.model("comment",commentSchema);