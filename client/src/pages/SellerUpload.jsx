import { useState, useRef } from "react";
import axios from "axios";
import { FiUpload, FiImage, FiX, FiCheck, FiTag, FiDollarSign, FiFileText, FiType } from "react-icons/fi";
import "./SellerUpload.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function SellerUpload() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    tags: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error' | null
  const [statusMessage, setStatusMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadStatus("error");
      setStatusMessage("Please select a valid image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus("error");
      setStatusMessage("File size must be under 10MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadStatus(null);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      setUploadStatus("error");
      setStatusMessage("Please select an image");
      return;
    }

    if (!formData.title || !formData.description || !formData.price) {
      setUploadStatus("error");
      setStatusMessage("Title, description, and price are required");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);

    const data = new FormData();
    data.append("image", imageFile);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("tags", formData.tags);

    try {
      await axios.post(`${BACKEND_URL}/api/upload`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      setUploadStatus("success");
      setStatusMessage("Listing published! It's now live for all buyers 🎉");

      // Reset form
      setFormData({ title: "", description: "", price: "", tags: "" });
      removeImage();
      setTimeout(() => setUploadProgress(0), 1500);
    } catch (error) {
      setUploadStatus("error");
      setStatusMessage(error.response?.data?.error || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="seller-page">
      <div className="seller-header animate-fade-in-up">
        <h1>
          <FiUpload className="header-icon" />
          Create Listing
        </h1>
        <p>Upload your product and it'll appear instantly on every buyer's feed.</p>
      </div>

      <form className="upload-form glass-card animate-fade-in-up" onSubmit={handleSubmit} id="seller-upload-form">
        {/* Image Upload Zone */}
        <div className="form-section">
          <label className="form-label">
            <FiImage /> Product Image
          </label>

          {!imagePreview ? (
            <label className="dropzone" htmlFor="image-input" id="image-dropzone">
              <FiUpload className="dropzone-icon" />
              <span className="dropzone-text">Click to upload image</span>
              <span className="dropzone-hint">JPG, PNG, GIF, WebP — Max 10MB</span>
              <input
                ref={fileInputRef}
                id="image-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                hidden
              />
            </label>
          ) : (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button type="button" className="remove-image-btn" onClick={removeImage} id="remove-image-btn">
                <FiX />
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="form-section">
          <label className="form-label" htmlFor="title-input">
            <FiType /> Title
          </label>
          <input
            id="title-input"
            name="title"
            type="text"
            className="form-input"
            placeholder="e.g., Vintage Leather Jacket"
            value={formData.title}
            onChange={handleInputChange}
            maxLength={100}
            required
          />
        </div>

        {/* Description */}
        <div className="form-section">
          <label className="form-label" htmlFor="description-input">
            <FiFileText /> Description
          </label>
          <textarea
            id="description-input"
            name="description"
            className="form-input form-textarea"
            placeholder="Describe your product in detail..."
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            maxLength={1000}
            required
          />
        </div>

        {/* Price & Tags row */}
        <div className="form-row">
          <div className="form-section">
            <label className="form-label" htmlFor="price-input">
              <FiDollarSign /> Price (₹)
            </label>
            <input
              id="price-input"
              name="price"
              type="number"
              min="0"
              step="0.01"
              className="form-input"
              placeholder="0.00"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-section">
            <label className="form-label" htmlFor="tags-input">
              <FiTag /> Tags
            </label>
            <input
              id="tags-input"
              name="tags"
              type="text"
              className="form-input"
              placeholder="fashion, vintage, leather"
              value={formData.tags}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Progress Bar */}
        {isUploading && (
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
            </div>
            <span className="progress-text">{uploadProgress}%</span>
          </div>
        )}

        {/* Status Message */}
        {uploadStatus && (
          <div className={`status-message status-${uploadStatus}`}>
            {uploadStatus === "success" ? <FiCheck /> : <FiX />}
            {statusMessage}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="submit-btn"
          disabled={isUploading}
          id="submit-listing-btn"
        >
          {isUploading ? (
            <>
              <span className="spinner" /> Uploading...
            </>
          ) : (
            <>
              <FiUpload /> Publish Listing
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default SellerUpload;
