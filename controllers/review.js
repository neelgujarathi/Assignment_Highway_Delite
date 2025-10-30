import Listing from "../models/listing.js";
import Review from "../models/review.js";
import ExpressError from "../utils/ExpressError.js";

export const createNewReview = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) throw new ExpressError(404, "Listing not found");

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  await newReview.save();

  listing.reviews.push(newReview._id);
  await listing.save();

  req.flash("success", "New Review Added...");
  res.redirect(`/listing/${id}`);
};

export const destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted Successfully...");
  res.redirect(`/listing/${id}`);
};
