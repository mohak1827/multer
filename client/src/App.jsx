import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import SellerUpload from "./pages/SellerUpload";
import BuyerFeed from "./pages/BuyerFeed";
import Landing from "./pages/Landing";
import { FiUpload, FiShoppingBag, FiHome } from "react-icons/fi";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
            <span className="brand-icon">⚡</span>
            <span className="brand-text">HealixRefer</span>
          </div>
          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <FiHome /> <span>Home</span>
            </NavLink>
            <NavLink to="/seller" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <FiUpload /> <span>Seller</span>
            </NavLink>
            <NavLink to="/buyer" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <FiShoppingBag /> <span>Buyer Feed</span>
            </NavLink>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/seller" element={<SellerUpload />} />
            <Route path="/buyer" element={<BuyerFeed />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
