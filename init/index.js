const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");

main()
    .then(()=>{
        console.log("connection successful");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/majorproject");
}

const initDb = async ()=>{
    await Listing.deleteMany({});
    // In JavaScript, the .map() method is an array method
    // that creates a new array by applying a function to each element of the original array
    initData.data = initData.data.map((obj)=>({...obj, owner:"6742820647b9e83635b879aa"}));
    await Listing.insertMany(initData.data);
}

initDb();