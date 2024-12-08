const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");
const { ref } = require("joi");

const listingSchema = new Schema({
    title:{type:String,
        required:true
    },
    description:{type:String},
    Image:{
        filename:String,
        url:String
    },
    price:{type:Number},
    location:{type:String},
    country:{type:String},
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
});
// deleting all the reviews which are belongs to the listing  

listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
       let result= await Review.deleteMany({ _id : { $in : listing.reviews}});
       console.log(result);
    }
   
});

const Listing =  mongoose.model("Listing",listingSchema);

module.exports = Listing;