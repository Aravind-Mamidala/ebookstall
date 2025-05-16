const mongoose=require("mongoose");
const bookSchema=new mongoose.Schema({
    title:{type:String,required:true},
    author:{type:String,required:true},
    price:{type:Number,required:true},
    coverImage: { type: String, required: true }, // Store image URL
    category: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const Book=mongoose.model("Book",bookSchema);
module.exports=Book;