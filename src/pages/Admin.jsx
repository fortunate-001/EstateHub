import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { signOut, onAuthStateChanged } from "firebase/auth";
import "../styles/Admin.css";

function Admin() {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalInquiries: 0,
    totalViews: 1247,
  });
  const navigate = useNavigate();

  // Sanitize filename
  const sanitizeFileName = (fileName) => {
    const lastDot = fileName.lastIndexOf(".");
    const extension = lastDot !== -1 ? fileName.slice(lastDot) : "";
    const nameWithoutExt =
      lastDot !== -1 ? fileName.slice(0, lastDot) : fileName;
    const cleanName = nameWithoutExt
      .replace(/[^a-zA-Z0-9]/g, "_")
      .replace(/_+/g, "_")
      .toLowerCase();
    const finalName = cleanName.replace(/^_+|_+$/g, "");
    return finalName + extension;
  };

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    type: "House",
    status: "Available",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
        loadAllData();
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadAllData = async () => {
    await Promise.all([fetchProperties(), fetchUsers(), fetchInquiries()]);
  };

  const fetchProperties = async () => {
    const q = query(collection(db, "properties"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const propertiesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProperties(propertiesData);
      setStats((prev) => ({ ...prev, totalProperties: propertiesData.length }));
    });
  };

  const fetchUsers = async () => {
    onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
      setStats((prev) => ({ ...prev, totalUsers: usersData.length }));
    });
  };

  const fetchInquiries = async () => {
    onSnapshot(collection(db, "inquiries"), (snapshot) => {
      const inquiriesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInquiries(inquiriesData);
      setStats((prev) => ({ ...prev, totalInquiries: inquiriesData.length }));
    });
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
    const cleanFileName = sanitizeFileName(file.name);
    const finalFileName = `${Date.now()}_${cleanFileName}`;
    const storageRef = ref(storage, `properties/${finalFileName}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image too large! Please select an image under 5MB.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }
      const newProperty = {
        ...formData,
        price: parseInt(formData.price),
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        size: parseInt(formData.size) || 0,
        imageUrl:
          imageUrl ||
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&h=300&fit=crop",
        createdAt: new Date().toISOString(),
        views: 0,
        inquiries: 0,
      };
      await addDoc(collection(db, "properties"), newProperty);
      setSuccessMessage("✅ Property added successfully!");
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      alert("Error adding property: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProperty = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }
      const propertyRef = doc(db, "properties", selectedProperty.id);
      await updateDoc(propertyRef, {
        ...formData,
        price: parseInt(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        size: parseInt(formData.size),
        imageUrl: imageUrl || formData.imageUrl,
      });
      setSuccessMessage("✅ Property updated successfully!");
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      alert("Error updating property");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (id, imageUrl) => {
    if (window.confirm("⚠️ Delete this property permanently?")) {
      try {
        if (imageUrl && imageUrl.includes("firebasestorage")) {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        }
        await deleteDoc(doc(db, "properties", id));
        setSuccessMessage("🗑️ Property deleted!");
      } catch (error) {
        alert("Error deleting property");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      location: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      size: "",
      type: "House",
      status: "Available",
      description: "",
      imageUrl: "",
    });
    setImageFile(null);
    setImagePreview("");
  };

  const openEditModal = (property) => {
    setSelectedProperty(property);
    setFormData({
      title: property.title,
      location: property.location,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      size: property.size,
      type: property.type,
      status: property.status || "Available",
      description: property.description || "",
      imageUrl: property.imageUrl,
    });
    setImagePreview(property.imageUrl);
    setShowEditModal(true);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const quickAddProperties = async () => {
    const { collection, addDoc } = await import("firebase/firestore");
    const { db } = await import("../firebase/firebase");

    const sampleProperties = [
      {
        title: "Luxury Duplex Ocean View",
        location: "Lekki, Lagos",
        price: 350000000,
        bedrooms: 5,
        bathrooms: 4,
        size: 550,
        type: "Duplex",
        status: "Available",
        description: "Beautiful luxury duplex with ocean view",
        imageUrl:
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&h=300&fit=crop",
        createdAt: new Date().toISOString(),
      },
      {
        title: "Modern 3-Bedroom Apartment",
        location: "Victoria Island, Lagos",
        price: 180000000,
        bedrooms: 3,
        bathrooms: 2,
        size: 200,
        type: "Apartment",
        status: "Available",
        description: "Contemporary apartment with city views",
        imageUrl:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop",
        createdAt: new Date().toISOString(),
      },
      {
        title: "Cozy Family Bungalow",
        location: "Ikeja, Lagos",
        price: 95000000,
        bedrooms: 4,
        bathrooms: 3,
        size: 280,
        type: "House",
        status: "Available",
        description: "Spacious family home",
        imageUrl:
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop",
        createdAt: new Date().toISOString(),
      },
      {
        title: "Exclusive Beachfront Villa",
        location: "Banana Island, Lagos",
        price: 650000000,
        bedrooms: 6,
        bathrooms: 5,
        size: 800,
        type: "Villa",
        status: "Available",
        description: "Luxury beachfront villa",
        imageUrl:
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=300&fit=crop",
        createdAt: new Date().toISOString(),
      },
      {
        title: "Luxury Penthouse",
        location: "Victoria Island, Lagos",
        price: 450000000,
        bedrooms: 4,
        bathrooms: 3,
        size: 350,
        type: "Apartment",
        status: "Available",
        description: "Stunning penthouse",
        imageUrl:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop",
        createdAt: new Date().toISOString(),
      },
      {
        title: "Prime Commercial Space",
        location: "Ikeja, Lagos",
        price: 250000000,
        bedrooms: 0,
        bathrooms: 4,
        size: 500,
        type: "Commercial",
        status: "Available",
        description: "Perfect for office or retail",
        imageUrl:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=300&fit=crop",
        createdAt: new Date().toISOString(),
      },
      {
        title: "Garden Estate Home",
        location: "Ajah, Lagos",
        price: 120000000,
        bedrooms: 4,
        bathrooms: 3,
        size: 320,
        type: "House",
        status: "Available",
        description: "Beautiful home in gated estate",
        imageUrl:
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=300&fit=crop",
        createdAt: new Date().toISOString(),
      },
      {
        title: "Waterfront Property",
        location: "Lekki, Lagos",
        price: 280000000,
        bedrooms: 3,
        bathrooms: 2,
        size: 250,
        type: "House",
        status: "Available",
        description: "Beautiful waterfront home",
        imageUrl:
          "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebf3?w=500&h=300&fit=crop",
        createdAt: new Date().toISOString(),
      },
    ];

    let added = 0;
    for (const property of sampleProperties) {
      try {
        await addDoc(collection(db, "properties"), property);
        added++;
      } catch (error) {
        console.error("Error:", property.title, error);
      }
    }
    alert(`✅ Added ${added} properties!`);
    window.location.reload();
  };

  if (!user) return <div className="loading-container">Loading...</div>;

  return (
    <div className="admin-container">
      {successMessage && <div className="success-toast">{successMessage}</div>}

      {/* Mobile Menu Button */}
      <button
        className="mobile-sidebar-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <i className="bx bx-menu"></i>
      </button>

      {/* Sidebar */}
      <div className={`admin-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <h2> EstateHub</h2>
          <p>Admin Panel</p>
          <small>{user?.email}</small>
          <button
            className="close-sidebar"
            onClick={() => setMobileMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => {
              setActiveTab("dashboard");
              setMobileMenuOpen(false);
            }}
          >
            <i className="bx bxs-dashboard"></i> Dashboard
          </button>
          <button
            className={activeTab === "properties" ? "active" : ""}
            onClick={() => {
              setActiveTab("properties");
              setMobileMenuOpen(false);
            }}
          >
            <i className="bx bxs-building"></i> Properties ({properties.length})
          </button>
          <button
            className={activeTab === "add" ? "active" : ""}
            onClick={() => {
              setActiveTab("add");
              setMobileMenuOpen(false);
            }}
          >
            <i className="bx bxs-plus-circle"></i> Add Property
          </button>
          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => {
              setActiveTab("users");
              setMobileMenuOpen(false);
            }}
          >
            <i className="bx bxs-group"></i> Users ({users.length})
          </button>
          <button
            className={activeTab === "inquiries" ? "active" : ""}
            onClick={() => {
              setActiveTab("inquiries");
              setMobileMenuOpen(false);
            }}
          >
            <i className="bx bxs-message"></i> Inquiries ({inquiries.length})
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <i className="bx bx-log-out"></i> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="dashboard-tab">
            <h1>Welcome back! </h1>
            <p>Here's what's happening with your platform today.</p>

            <div className="stats-grid">
              <div className="stat-card">
                <i className="bx bxs-building"></i>
                <div className="stat-value">{stats.totalProperties}</div>
                <div className="stat-label">Properties</div>
              </div>
              <div className="stat-card">
                <i className="bx bxs-group"></i>
                <div className="stat-value">{stats.totalUsers}</div>
                <div className="stat-label">Users</div>
              </div>
              <div className="stat-card">
                <i className="bx bxs-message"></i>
                <div className="stat-value">{stats.totalInquiries}</div>
                <div className="stat-label">Inquiries</div>
              </div>
              <div className="stat-card">
                <i className="bx bxs-show"></i>
                <div className="stat-value">
                  {stats.totalViews.toLocaleString()}
                </div>
                <div className="stat-label">Views</div>
              </div>
            </div>

            <div className="quick-add-card">
              <h3> Quick Add Sample Properties</h3>
              <p>
                Click below to add 8 beautiful sample properties to your
                database
              </p>
              <button className="quick-add-btn" onClick={quickAddProperties}>
                 Add Sample Properties 
              </button>
            </div>
          </div>
        )}

        {/* ADD PROPERTY */}
        {activeTab === "add" && (
          <div className="add-property-tab">
            <h1>➕ Add New Property</h1>
            <form onSubmit={handleAddProperty} className="property-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₦) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option>House</option>
                    <option>Apartment</option>
                    <option>Duplex</option>
                    <option>Villa</option>
                    <option>Land</option>
                    <option>Commercial</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option>Available</option>
                    <option>Sold</option>
                    <option>Pending</option>
                    <option>Rented</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bedrooms: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bathrooms: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Size (sqft)</label>
                  <input
                    type="number"
                    value={formData.size}
                    onChange={(e) =>
                      setFormData({ ...formData, size: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="form-group">
                <label>Image</label>
                <div className="image-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="imageUpload"
                    style={{ display: "none" }}
                  />
                  <label htmlFor="imageUpload" className="upload-label">
                    <i className="bx bx-cloud-upload"></i> Upload Image
                  </label>
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview("");
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-buttons">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "➕ Add Property"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={resetForm}
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PROPERTIES LIST */}
        {activeTab === "properties" && (
          <div className="properties-tab">
            <div className="tab-header">
              <h1>📋 Properties ({properties.length})</h1>
              <button
                className="btn-primary"
                onClick={() => setActiveTab("add")}
              >
                + Add New
              </button>
            </div>
            <div className="properties-list">
              {properties.map((property) => (
                <div key={property.id} className="property-admin-card">
                  <div className="property-admin-image">
                    <img src={property.imageUrl} alt={property.title} />
                    <span className={`status-badge ${property.status}`}>
                      {property.status}
                    </span>
                  </div>
                  <div className="property-admin-info">
                    <h3>{property.title}</h3>
                    <p>{property.location}</p>
                    <p className="price">₦{property.price?.toLocaleString()}</p>
                    <div className="property-details">
                      <span>{property.bedrooms} beds</span>
                      <span>{property.bathrooms} baths</span>
                      <span>{property.size} sqft</span>
                    </div>
                  </div>
                  <div className="property-admin-actions">
                    <button
                      className="edit-btn"
                      onClick={() => openEditModal(property)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDeleteProperty(property.id, property.imageUrl)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <div className="users-tab">
            <h1>👥 Users ({users.length})</h1>
            <div className="users-list">
              {users.map((userItem) => (
                <div key={userItem.id} className="user-card">
                  <i className="bx bxs-user-circle"></i>
                  <div className="user-info">
                    <h4>{userItem.name || "User"}</h4>
                    <p>{userItem.email}</p>
                    <p>
                      Age: {userItem.age || "N/A"} | Gender:{" "}
                      {userItem.gender || "N/A"} | Phone:{" "}
                      {userItem.phone || "N/A"}
                    </p>
                    <small>
                      Joined:{" "}
                      {userItem.createdAt?.toDate().toLocaleDateString() ||
                        "Recently"}{" "}
                      | Logins: {userItem.loginCount || 0}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INQUIRIES */}
        {activeTab === "inquiries" && (
          <div className="inquiries-tab">
            <h1>💬 Inquiries ({inquiries.length})</h1>
            <div className="inquiries-list">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="inquiry-card">
                  <div className="inquiry-header">
                    <h3>{inquiry.name}</h3>
                    <span>{inquiry.createdAt?.toDate().toLocaleString()}</span>
                  </div>
                  <p>
                    <strong>Email:</strong> {inquiry.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {inquiry.phone}
                  </p>
                  <p>
                    <strong>Property:</strong> {inquiry.property}
                  </p>
                  <p>
                    <strong>Message:</strong> {inquiry.message}
                  </p>
                  <button
                    className="whatsapp-btn-small"
                    onClick={() =>
                      window.open(`https://wa.me/${inquiry.phone}`)
                    }
                  >
                    <i className="bx bxl-whatsapp"></i> Reply
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="modal" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>✏️ Edit Property</h2>
            <form onSubmit={handleEditProperty}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option>Available</option>
                    <option>Sold</option>
                    <option>Pending</option>
                  </select>
                </div>
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn-primary">
                  Update
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
