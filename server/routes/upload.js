const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const Listing = require("../models/Listing");
const cloudinary = require("../config/cloudinary");

// POST /api/upload — Seller uploads image + content
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const { title, description, price, tags } = req.body;

    if (!title || !description || price === undefined) {
      return res.status(400).json({ error: "Title, description, and price are required" });
    }

    // Parse tags — accept comma-separated string or JSON array
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch {
        parsedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
      }
    }

    const listing = await Listing.create({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      tags: parsedTags,
      imageUrl: req.file.path, // Cloudinary secure URL
      cloudinaryId: req.file.filename, // Cloudinary public_id
    });

    // Emit real-time event to all connected buyers
    const io = req.app.get("io");
    io.emit("new_listing", {
      _id: listing._id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      tags: listing.tags,
      imageUrl: listing.imageUrl,
      createdAt: listing.createdAt,
    });

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message || "Server error during upload" });
  }
});

// GET /api/listings — Buyer fetches all listings (newest first)
router.get("/listings", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [listings, total] = await Promise.all([
      Listing.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Listing.countDocuments(),
    ]);

    res.json({
      success: true,
      listings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch listings error:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

// DELETE /api/listings/:id — Remove a listing
router.delete("/listings/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // Delete image from Cloudinary
    if (listing.cloudinaryId) {
      await cloudinary.uploader.destroy(listing.cloudinaryId);
    }

    await Listing.findByIdAndDelete(req.params.id);

    // Notify buyers of deletion
    const io = req.app.get("io");
    io.emit("listing_deleted", { _id: req.params.id });

    res.json({ success: true, message: "Listing deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete listing" });
  }
});

module.exports = router;
