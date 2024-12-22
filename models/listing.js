const mongoose = require("mongoose");
const Review = require("./review.js");


const listingSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    required:true,
    set: (v) => v===""? "https://images.unsplash.com/photo-1667850132998-013f89c6aec4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDR8RnpvM3p1T0hONnd8fGVufDB8fHx8fA%3D%3D" : v,
  },
  image:{
    url:String,
    filename:String,
  },
  price:Number,
  location:String,
  country:String,
  reviews:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Review"
  }
  ],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
})

listingSchema.post("findOneAndDelete", async (listing) =>{
  if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;