import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { FiShoppingBag, FiClock, FiTag, FiWifi, FiWifiOff, FiLoader } from "react-icons/fi";
import "./BuyerFeed.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function BuyerFeed() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [newListingIds, setNewListingIds] = useState(new Set());

  // Fetch existing listings on mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/listings`);
        setListings(res.data.listings || []);
      } catch (err) {
        console.error("Failed to fetch listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Socket.IO connection
  useEffect(() => {
    const socket = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      setConnected(true);
      console.log("🔌 Connected to server");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("❌ Disconnected from server");
    });

    // Listen for new listings
    socket.on("new_listing", (listing) => {
      setListings((prev) => [listing, ...prev]);
      setNewListingIds((prev) => new Set(prev).add(listing._id));

      // Remove "new" highlight after 5 seconds
      setTimeout(() => {
        setNewListingIds((prev) => {
          const next = new Set(prev);
          next.delete(listing._id);
          return next;
        });
      }, 5000);
    });

    // Listen for deleted listings
    socket.on("listing_deleted", ({ _id }) => {
      setListings((prev) => prev.filter((l) => l._id !== _id));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="buyer-page">
      <div className="buyer-header animate-fade-in-up">
        <div className="header-top">
          <h1>
            <FiShoppingBag className="header-icon" />
            Live Feed
          </h1>
          <div className={`connection-badge ${connected ? "connected" : "disconnected"}`}>
            {connected ? <FiWifi /> : <FiWifiOff />}
            {connected ? "Live" : "Offline"}
          </div>
        </div>
        <p>New listings appear here in real-time — no refresh needed.</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <FiLoader className="loading-spinner" />
          <p>Loading listings...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="empty-state glass-card animate-fade-in-up">
          <div className="empty-icon">📦</div>
          <h3>No Listings Yet</h3>
          <p>When a seller uploads a listing, it will appear here instantly.</p>
        </div>
      ) : (
        <div className="listings-grid">
          {listings.map((listing, index) => (
            <div
              key={listing._id}
              className={`listing-card glass-card ${newListingIds.has(listing._id) ? "new-listing" : ""}`}
              style={{ animationDelay: `${index * 0.05}s` }}
              id={`listing-${listing._id}`}
            >
              {newListingIds.has(listing._id) && (
                <div className="new-badge">NEW</div>
              )}

              <div className="card-image">
                <img src={listing.imageUrl} alt={listing.title} loading="lazy" />
                <div className="card-price">{formatPrice(listing.price)}</div>
              </div>

              <div className="card-body">
                <h3 className="card-title">{listing.title}</h3>
                <p className="card-description">{listing.description}</p>

                {listing.tags && listing.tags.length > 0 && (
                  <div className="card-tags">
                    <FiTag className="tags-icon" />
                    {listing.tags.map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="card-footer">
                  <span className="card-date">
                    <FiClock /> {formatDate(listing.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BuyerFeed;
