const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    let allListings  = await Listing.find();
    res.render("./listings/index.ejs",{allListings});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs");
}

module.exports.createListing = async (req,res)=>{
    // console.log("hello");
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,filename);
    const newListing = new Listing(req.body.listing);
    // who ever logged in we are saving that user id in the newly created listing
    newListing.owner = req.user._id;
    newListing.Image = {url,filename};
    await newListing.save();
    req.flash("success","successfully created new Listing");
    res.redirect("/listings");
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    //  here we are also doing nested populate
    const listing= await Listing.findById({"_id":id}).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
    req.flash("error","Listing you requested does not exist!");
    res.redirect("/listings");
        
    }
    res.render("./listings/show.ejs",{listing});
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        res.redirect("/listings");
            
        }
    res.render("./listings/edit.ejs",{listing});
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof(req.file) !== "undefined" ){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.Image = {url,filename};
        await listing.save();
    }
    req.flash("success","successfully Listing is updated");
    res.redirect(`/listings/${id}`)
}

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    let result = await Listing.findByIdAndDelete(id);
    console.log("delete",result)
    req.flash("success",`${result.title} listing is deleted`);
    res.redirect("/listings");
}