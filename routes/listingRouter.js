import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listing.js";
import { isLoggedIn, isOwner, validateSchema } from "../middleware.js";
import * as listingController from "../controllers/listing.js";
import { upload, cloudinary } from "../cloudConfig.js";

const router = express.Router();

// Get all listings & Create new listing
router.route("/").get(wrapAsync(listingController.index)).post(
  isLoggedIn,
  upload.single("listing[image]"), // same field name
  validateSchema,
  wrapAsync(listingController.createNewList)
);

// Update listing
router.patch(
  "/edit/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  wrapAsync(listingController.updateListing)
);

// Route for new listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Route for edit form
router.get(
  "/edit/:id",
  isLoggedIn,
  validateSchema,
  wrapAsync(listingController.renderEditForm)
);

// Route for delete
router.delete(
  "/delete/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

// Route for showing individual listing
router.get("/:id", wrapAsync(listingController.showListing));

export default router;
