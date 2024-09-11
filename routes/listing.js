const express  = require("express");
const wrapAsync = require("../utils/wrapAsync");
const Listing = require('../models/listing.js');
const router = express.Router();
const {isLoggedIn , isOwner ,validateListing} = require("../middleware.js");
const { index, renderNewForm, showListing, createListing, editListing, updateListing, deleteListing } = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
//const upload = multer({ storage: multer.memoryStorage() });

router.route("/")
.get(wrapAsync(index))
 .post(isLoggedIn,  
    upload.single("listing[image]"),validateListing, wrapAsync(createListing))
// .post(upload.single("listing[image]"),(req,res)=>{
//     res.send(req.file);
// });

// .post(upload.single('listing[image]'), (req, res) => {
//     const fileUrl = req.file.path;
//     // Use the fileUrl to create a new listing
//     const listing = new Listing({ image: fileUrl, /* other listing properties */ });
//     listing.save((err) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send({ message: 'Error creating listing' });
//       } else {
//         res.send({ message: 'Listing created successfully' });
//       }
//     });
//   });

router.get("/new", isLoggedIn, renderNewForm);

router.route("/:id")
.get(wrapAsync(showListing))
.put(isLoggedIn, isOwner,upload.single("listing[image]"), validateListing, wrapAsync(updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(deleteListing));


router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(  editListing));

module.exports = router;