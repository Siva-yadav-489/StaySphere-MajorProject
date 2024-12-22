const Listing = require("../models/listing.js");


module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    console.log("listings route successful");
    res.render("listings/index.ejs", {allListings});
};


module.exports.renderNewListingForm = (req,res)=>{
    console.log("new listing route successful");
    res.render("listings/new.ejs");
};

module.exports.addNewListing = async (req,res) => {
    //uploading image
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // to add owner for new listing
    newListing.image = {url, filename};
    // console.log(url, filename);
    await newListing.save();
    //to flash a message
    req.flash("success", "New Listing created successfully.")
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    // if trying to access deleted listing
    if(!listing){
        req.flash("error", "Listing you requested does not exist.")
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
};

module.exports.editListing = async (req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true});
    //uploading new image
    if(typeof req.file != undefined){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    //to pass message in flash
    req.flash("success", "Edited Listing successfully.")
    res.redirect(`/listings/${id}`);
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate:{path: "author"}}).populate("owner");
    // if trying to access deleted listing
    if(!listing){
        req.flash("error", "Listing you requested does not exist.")
        res.redirect("/listings");
    }
    console.log("show route successful")
    res.render("listings/show.ejs", {listing});
};

module.exports.destroyListing = async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    //to pass message in flash
    req.flash("success", "New Listing deleted successfully.")
    res.redirect("/listings");
};