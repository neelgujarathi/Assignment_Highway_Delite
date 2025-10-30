import express from "express";
import Review from "../models/review.js";
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listing.js";
import ExpressError from "../utils/ExpressError.js";
import { validateReview, isLoggedIn, isReviewAuthor } from "../middleware.js";
import * as reviewController from "../controllers/review.js";

const router = express.Router({ mergeParams: true });

// create review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createNewReview)
);

//delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

export default router;
