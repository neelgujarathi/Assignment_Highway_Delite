import express from "express";
const router = express.Router();

router.post("/confirm", async (req, res) => {
  try {
    const { listingId, quantity, totalPrice, listingTitle, country } = req.body;

    const username = (req.user && req.user.username) || "Maya Shinde";

    // ✅ Create complete booking object
    const booking = {
      _id: listingId || "0001",
      listingTitle: listingTitle || "Unknown Listing",
      country: country || "Unknown Country",
      quantity: quantity || 1,
      totalPrice: totalPrice || 0,
      date: new Date().toLocaleDateString(),
      user: { username }, // 👈 always exists
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
