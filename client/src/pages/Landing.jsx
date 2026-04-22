import { Link } from "react-router-dom";
import { FiUpload, FiShoppingBag, FiZap, FiCloud, FiDatabase, FiRadio } from "react-icons/fi";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-badge">
            <FiZap /> Real-Time Marketplace
          </div>
          <h1 className="hero-title">
            List. Connect.
            <span className="gradient-text"> Sell Instantly.</span>
          </h1>
          <p className="hero-subtitle">
            Upload your product listings and watch them appear on every buyer's screen in real-time.
            No refresh needed — powered by WebSockets.
          </p>
          <div className="hero-actions">
            <Link to="/seller" className="btn btn-primary" id="hero-seller-btn">
              <FiUpload /> Start Selling
            </Link>
            <Link to="/buyer" className="btn btn-secondary" id="hero-buyer-btn">
              <FiShoppingBag /> Browse Feed
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card card-1">
            <div className="visual-card-img" />
            <div className="visual-card-lines">
              <div className="line w-70" />
              <div className="line w-50" />
            </div>
          </div>
          <div className="visual-card card-2">
            <div className="visual-card-img" />
            <div className="visual-card-lines">
              <div className="line w-60" />
              <div className="line w-80" />
            </div>
          </div>
          <div className="visual-card card-3">
            <div className="visual-card-img" />
            <div className="visual-card-lines">
              <div className="line w-80" />
              <div className="line w-40" />
            </div>
          </div>
          <div className="pulse-ring ring-1" />
          <div className="pulse-ring ring-2" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{ background: "rgba(167, 139, 250, 0.1)" }}>
              <FiCloud style={{ color: "#a78bfa" }} />
            </div>
            <h3>Cloud Storage</h3>
            <p>Images upload directly to Cloudinary — no server disk needed. Fast, reliable, and globally distributed.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: "rgba(45, 212, 191, 0.1)" }}>
              <FiDatabase style={{ color: "#2dd4bf" }} />
            </div>
            <h3>MongoDB Atlas</h3>
            <p>All listing metadata persisted in MongoDB Atlas. Query, paginate, and filter with ease.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: "rgba(244, 114, 182, 0.1)" }}>
              <FiRadio style={{ color: "#f472b6" }} />
            </div>
            <h3>Socket.IO Push</h3>
            <p>Every new listing pushes to all connected buyers instantly via WebSocket — zero latency, zero refresh.</p>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="tech-section">
        <div className="tech-badges">
          {["Express.js", "Socket.IO", "Cloudinary", "MongoDB", "React", "Vite"].map((tech) => (
            <span key={tech} className="tech-badge">{tech}</span>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Landing;
