import express from "express";
import Listing from "../models/listing.js";

const router = express.Router();

// ✅ POST /booking/confirm
router.post("/confirm", async (req, res) => {
  try {
    const { listingId, quantity } = req.body;

    // Fetch listing details from MongoDB
    const listing = await Listing.findById(listingId).populate("owner");

    if (!listing) {
      return res.status(404).send("Listing not found!");
    }

    // Example logged-in user (for testing)
    const username = (req.user && req.user.username) || "Maya Shinde";

    // ✅ Calculate total price (price * quantity + taxes)
    const subtotal = listing.price * quantity;
    const taxes = 59;
    const totalPrice = subtotal + taxes;

    // ✅ Create booking data to pass to EJS
    const booking = {
      listingTitle: listing.title,
      country: listing.country,
      price: listing.price,
      quantity,
      totalPrice,
      date: new Date().toLocaleDateString(),
      user: { username },
    };

    console.log("✅ Booking Confirmed:", booking);

    // ✅ Render confirmation page
    res.render("bookings/confirmation", { booking });
  } catch (err) {
    console.error("❌ Error confirming booking:", err);
    res.status(500).send("Something went wrong!");
  }
});

export default router;
