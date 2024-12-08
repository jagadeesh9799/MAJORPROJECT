const express = require("express");
// mergeparams: true by this we can able to use the parameters from the parent route
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const multer = require("multer")
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})
//controllers
const listingController = require("../controllers/listings.js");



router
     .route("/")
     // show all listings
     .get(wrapAsync(listingController.index))
     // create new listing route
     .post(
          isLoggedIn,
          // validateListing,
          upload.single("listing[Image]"),
          wrapAsync(listingController.createListing)
     )

//to create new listing render form
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
     .route("/:id")
     //  showing about particulat listing
     .get(wrapAsync(listingController.showListing))
     // Updating the listing
     .put(isLoggedIn,isOwner,upload.single("listing[Image]"),validateListing,wrapAsync(listingController.updateListing))
     // deleting the listing
     .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

// to edit the listing
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports = router;




