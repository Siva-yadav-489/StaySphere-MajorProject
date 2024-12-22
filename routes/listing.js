const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js")
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })


router.route("/")
    .get(wrapAsync(listingController.index)) //index route
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync( listingController.addNewListing)) //addNewListing

router.get("/new", isLoggedIn, listingController.renderNewListingForm);//NewListingFor

router.route("/:id")
    .get(wrapAsync( listingController.showListing)) //showListing
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.editListing)) //editListing
    .delete(isLoggedIn, isOwner, wrapAsync( listingController.destroyListing)) //destroyListing


router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync( listingController.renderEditForm)) //edit form 

module.exports = router;