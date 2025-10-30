import Listing from "../models/listing.js";
import { cloudinary } from "../cloudConfig.js";

//index page - Show all Listings
export const index = async (req, res) => {
  const data = await Listing.find({});
  res.render("./listing/showData.ejs", { data });
};

//Render create new listing form
export const renderNewForm = (req, res) => {
  res.render("./listing/new.ejs");
};

//Update the existing listing
export const updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  if (req.file) {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "List Updated Successfully...");
  res.redirect("/listing");
};

//Create new listing
export const createNewList = async (req, res) => {
  try {
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "wanderlust_DEV" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      listing.image = {
        url: uploadResult.secure_url,
        filename: uploadResult.public_id,
      };
    }

    await listing.save();
    req.flash("success", "Successfully created new listing!");
    res.redirect(`/listing/${listing._id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Error creating listing!");
    res.redirect("/listing/new");
  }
};

//Render edit form
export const renderEditForm = async (req, res) => {
  const { id } = req.params;
  const data = await Listing.findById(id);
  res.render("./listing/edit.ejs", { data });
};

//Destroy existing listing
export const destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "List deleted Successfully...");
  res.redirect("/listing");
};

//Show individual listing
export const showListing = async (req, res) => {
  const { id } = req.params;
  const data = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!data) {
    req.flash("error", "Listing you requested for does not exist...");
    return res.redirect("/listing");
  }

  res.render("./listing/showOne.ejs", { data });
};
