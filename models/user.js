const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    
    email:{
        type:String,
        required:true
    }
})
// passportLocalMongoose automatically defines username and password
// So, no need to define them again and also some functions
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);